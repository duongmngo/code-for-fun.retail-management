package com.retailmanagement.common.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private UUID id;
    private UUID tenantId;
    private String email;
    private String password;
    private Set<String> roles;
    private Set<String> permissions;
    private boolean enabled;
    private boolean accountNonLocked;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        
        // Add roles with ROLE_ prefix
        roles.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role)));
        
        // Add permissions as authorities
        permissions.forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission)));
        
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public boolean hasRole(String role) {
        return roles.contains(role);
    }

    public boolean hasPermission(String permission) {
        return permissions.contains(permission);
    }

    public boolean hasAnyRole(String... roleNames) {
        return Arrays.stream(roleNames).anyMatch(roles::contains);
    }

    public boolean hasAnyPermission(String... permissionNames) {
        return Arrays.stream(permissionNames).anyMatch(permissions::contains);
    }

    public static UserPrincipal fromToken(UUID userId, UUID tenantId, String email, 
                                          Set<String> roles, Set<String> permissions) {
        return UserPrincipal.builder()
            .id(userId)
            .tenantId(tenantId)
            .email(email)
            .roles(roles)
            .permissions(permissions)
            .enabled(true)
            .accountNonLocked(true)
            .build();
    }
}
