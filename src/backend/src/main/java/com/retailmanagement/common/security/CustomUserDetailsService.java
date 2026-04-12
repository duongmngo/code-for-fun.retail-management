package com.retailmanagement.common.security;

import com.retailmanagement.infrastructure.persistence.entity.User;
import com.retailmanagement.infrastructure.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        throw new UnsupportedOperationException("Use loadUserByUserId instead");
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(UUID userId) {
        User user = userRepository.findByIdWithRolesAndPermissions(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        return createUserPrincipal(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserByEmailAndTenantCode(String email, String tenantCode) {
        User user = userRepository.findByEmailAndTenantCodeWithRoles(email, tenantCode)
            .orElseThrow(() -> new UsernameNotFoundException(
                "User not found with email: " + email + " in tenant: " + tenantCode));

        return createUserPrincipal(user);
    }

    private UserPrincipal createUserPrincipal(User user) {
        Set<String> roles = user.getRoles().stream()
            .map(role -> role.getName())
            .collect(Collectors.toSet());

        Set<String> permissions = user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .map(permission -> permission.getName())
            .collect(Collectors.toSet());

        return UserPrincipal.builder()
            .id(user.getId())
            .tenantId(user.getTenant().getId())
            .email(user.getEmail())
            .password(user.getPasswordHash())
            .roles(roles)
            .permissions(permissions)
            .enabled(user.isActive())
            .accountNonLocked(!user.isLocked())
            .build();
    }
}
