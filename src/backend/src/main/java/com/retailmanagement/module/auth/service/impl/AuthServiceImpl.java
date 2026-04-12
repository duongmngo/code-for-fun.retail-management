package com.retailmanagement.module.auth.service.impl;

import com.retailmanagement.common.exception.BusinessException;
import com.retailmanagement.common.security.JwtTokenProvider;
import com.retailmanagement.common.security.TenantContext;
import com.retailmanagement.common.security.UserPrincipal;
import com.retailmanagement.infrastructure.persistence.entity.*;
import com.retailmanagement.infrastructure.persistence.repository.*;
import com.retailmanagement.module.auth.dto.request.RefreshTokenRequest;
import com.retailmanagement.module.auth.dto.request.SignInRequest;
import com.retailmanagement.module.auth.dto.request.SignUpRequest;
import com.retailmanagement.module.auth.dto.response.AuthResponse;
import com.retailmanagement.module.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LocationRepository locationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TenantContext tenantContext;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    @Override
    @Transactional
    public AuthResponse signUp(SignUpRequest request, String ipAddress) {
        log.info("Processing sign up for tenant: {}", request.getTenantCode());

        // Check if tenant code already exists
        if (tenantRepository.existsByCode(request.getTenantCode())) {
            throw new BusinessException("TENANT_CODE_EXISTS", 
                "Tenant code already exists: " + request.getTenantCode());
        }

        // Create tenant
        Tenant tenant = Tenant.builder()
            .code(request.getTenantCode())
            .name(request.getBusinessName())
            .businessName(request.getBusinessName())
            .address(request.getBusinessAddress())
            .phone(request.getBusinessPhone())
            .email(request.getEmail())
            .status(Tenant.TenantStatus.ACTIVE)
            .subscriptionPlan(Tenant.SubscriptionPlan.FREE)
            .build();

        tenant = tenantRepository.save(tenant);
        log.info("Created tenant with ID: {}", tenant.getId());

        // Create default warehouse
        Location warehouse = Location.builder()
            .tenantId(tenant.getId())
            .code("WH-MAIN")
            .name("Main Warehouse")
            .locationType(Location.LocationType.WAREHOUSE)
            .isDefaultWarehouse(true)
            .isActive(true)
            .build();
        locationRepository.save(warehouse);

        // Create default branch
        Location branch = Location.builder()
            .tenantId(tenant.getId())
            .code("BR-MAIN")
            .name("Main Branch")
            .locationType(Location.LocationType.BRANCH)
            .parent(warehouse)
            .isActive(true)
            .build();
        branch = locationRepository.save(branch);

        // Get tenant admin role
        Role adminRole = roleRepository.findSystemRoleByNameWithPermissions(Role.TENANT_ADMIN)
            .orElseThrow(() -> new BusinessException("ROLE_NOT_FOUND", "Tenant admin role not found"));

        // Create admin user
        User user = User.builder()
            .tenant(tenant)
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .phone(request.getPhone())
            .status(User.UserStatus.ACTIVE)
            .emailVerified(false)
            .branch(branch)
            .build();
        
        user.addRole(adminRole);
        user = userRepository.save(user);
        log.info("Created admin user with ID: {}", user.getId());

        // Generate tokens
        return generateAuthResponse(user, ipAddress, request.getEmail());
    }

    @Override
    @Transactional
    public AuthResponse signIn(SignInRequest request, String ipAddress) {
        log.info("Processing sign in for user: {} in tenant: {}", request.getEmail(), request.getTenantCode());

        // Find user
        User user = userRepository.findByEmailAndTenantCodeWithRoles(request.getEmail(), request.getTenantCode())
            .orElseThrow(() -> new BusinessException("INVALID_CREDENTIALS", "Invalid email or password"));

        // Check if account is locked
        if (user.isLocked()) {
            throw new BusinessException("ACCOUNT_LOCKED", 
                "Account is locked. Please try again later or contact support.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            handleFailedLogin(user);
            throw new BusinessException("INVALID_CREDENTIALS", "Invalid email or password");
        }

        // Check if user is active
        if (!user.isActive()) {
            throw new BusinessException("ACCOUNT_INACTIVE", "Account is not active");
        }

        // Check if tenant is active
        if (!user.getTenant().isActive()) {
            throw new BusinessException("TENANT_INACTIVE", "Your organization account is not active");
        }

        // Reset failed attempts and update last login
        user.resetFailedLoginAttempts();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        return generateAuthResponse(user, ipAddress, request.getDeviceInfo());
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request, String ipAddress) {
        log.info("Processing refresh token");

        RefreshToken refreshToken = refreshTokenRepository.findByTokenWithUser(request.getRefreshToken())
            .orElseThrow(() -> new BusinessException("INVALID_REFRESH_TOKEN", "Invalid refresh token"));

        if (!refreshToken.isValid()) {
            throw new BusinessException("INVALID_REFRESH_TOKEN", "Refresh token is expired or revoked");
        }

        User user = refreshToken.getUser();

        // Check if user is still active
        if (!user.isActive()) {
            throw new BusinessException("ACCOUNT_INACTIVE", "Account is not active");
        }

        // Revoke old refresh token
        refreshToken.revoke();
        refreshToken.setReplacedByToken(jwtTokenProvider.generateRefreshToken());
        refreshTokenRepository.save(refreshToken);

        // Reload user with roles
        user = userRepository.findByIdWithRolesAndPermissions(user.getId())
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        // Generate new tokens
        return generateAuthResponse(user, ipAddress, refreshToken.getDeviceInfo());
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        log.info("Processing logout");

        refreshTokenRepository.findByToken(refreshToken)
            .ifPresent(token -> {
                token.revoke();
                refreshTokenRepository.save(token);
            });
    }

    @Override
    @Transactional
    public void logoutAll() {
        log.info("Processing logout from all devices");

        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();

        refreshTokenRepository.revokeAllByUserId(principal.getId(), LocalDateTime.now());
    }

    private AuthResponse generateAuthResponse(User user, String ipAddress, String deviceInfo) {
        Set<String> roles = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());

        Set<String> permissions = user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .map(Permission::getName)
            .collect(Collectors.toSet());

        // Generate access token
        String accessToken = jwtTokenProvider.generateAccessToken(
            user.getId(),
            user.getTenant().getId(),
            user.getEmail(),
            roles,
            permissions
        );

        // Generate and save refresh token
        String refreshTokenValue = jwtTokenProvider.generateRefreshToken();
        RefreshToken refreshToken = RefreshToken.builder()
            .user(user)
            .token(refreshTokenValue)
            .expiresAt(LocalDateTime.now().plusSeconds(
                jwtTokenProvider.getRefreshTokenExpirationMs() / 1000))
            .deviceInfo(deviceInfo)
            .ipAddress(ipAddress)
            .build();
        refreshTokenRepository.save(refreshToken);

        // Build response
        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshTokenValue)
            .tokenType("Bearer")
            .expiresIn(jwtTokenProvider.getAccessTokenExpirationMs() / 1000)
            .user(buildUserInfo(user, roles, permissions))
            .build();
    }

    private AuthResponse.UserInfo buildUserInfo(User user, Set<String> roles, Set<String> permissions) {
        Tenant tenant = user.getTenant();
        Location branch = user.getBranch();

        return AuthResponse.UserInfo.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .fullName(user.getFullName())
            .avatarUrl(user.getAvatarUrl())
            .tenant(AuthResponse.TenantInfo.builder()
                .id(tenant.getId())
                .code(tenant.getCode())
                .name(tenant.getName())
                .businessName(tenant.getBusinessName())
                .logoUrl(tenant.getLogoUrl())
                .build())
            .branch(branch != null ? AuthResponse.BranchInfo.builder()
                .id(branch.getId())
                .code(branch.getCode())
                .name(branch.getName())
                .build() : null)
            .roles(roles)
            .permissions(permissions)
            .lastLoginAt(user.getLastLoginAt())
            .build();
    }

    private void handleFailedLogin(User user) {
        user.incrementFailedLoginAttempts();
        
        if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
            user.setStatus(User.UserStatus.LOCKED);
            log.warn("User account locked due to too many failed attempts: {}", user.getEmail());
        }
        
        userRepository.save(user);
    }
}
