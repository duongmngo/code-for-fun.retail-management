package com.retailmanagement.infrastructure.persistence.repository;

import com.retailmanagement.infrastructure.persistence.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    
    Optional<Role> findByNameAndTenantId(String name, UUID tenantId);
    
    @Query("SELECT r FROM Role r WHERE r.name = :name AND (r.tenantId = :tenantId OR r.tenantId IS NULL)")
    Optional<Role> findByNameAndTenantIdOrSystemRole(@Param("name") String name, @Param("tenantId") UUID tenantId);
    
    @Query("SELECT r FROM Role r WHERE r.name = :name AND r.tenantId IS NULL AND r.isSystemRole = true")
    Optional<Role> findSystemRoleByName(@Param("name") String name);
    
    @Query("SELECT r FROM Role r JOIN FETCH r.permissions WHERE r.name = :name AND r.tenantId IS NULL AND r.isSystemRole = true")
    Optional<Role> findSystemRoleByNameWithPermissions(@Param("name") String name);
    
    List<Role> findByTenantIdOrIsSystemRoleTrue(UUID tenantId);
    
    List<Role> findByTenantId(UUID tenantId);
    
    @Query("SELECT r FROM Role r WHERE r.isSystemRole = true")
    List<Role> findAllSystemRoles();
}
