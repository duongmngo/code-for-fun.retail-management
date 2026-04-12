package com.retailmanagement.infrastructure.persistence.repository;

import com.retailmanagement.infrastructure.persistence.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    
    Optional<Permission> findByName(String name);
    
    List<Permission> findByModule(String module);
    
    List<Permission> findByNameIn(List<String> names);
}
