package com.retailmanagement.infrastructure.persistence.repository;

import com.retailmanagement.infrastructure.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmailAndTenantId(String email, UUID tenantId);
    
    @Query("SELECT u FROM User u JOIN FETCH u.tenant WHERE u.email = :email AND u.tenant.code = :tenantCode")
    Optional<User> findByEmailAndTenantCode(@Param("email") String email, @Param("tenantCode") String tenantCode);
    
    @Query("SELECT u FROM User u JOIN FETCH u.roles r JOIN FETCH r.permissions WHERE u.id = :id")
    Optional<User> findByIdWithRolesAndPermissions(@Param("id") UUID id);
    
    @Query("SELECT u FROM User u JOIN FETCH u.tenant JOIN FETCH u.roles r JOIN FETCH r.permissions WHERE u.email = :email AND u.tenant.code = :tenantCode")
    Optional<User> findByEmailAndTenantCodeWithRoles(@Param("email") String email, @Param("tenantCode") String tenantCode);
    
    boolean existsByEmailAndTenantId(String email, UUID tenantId);
    
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email AND u.tenant.code = :tenantCode")
    boolean existsByEmailAndTenantCode(@Param("email") String email, @Param("tenantCode") String tenantCode);
}
