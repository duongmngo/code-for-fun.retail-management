package com.retailmanagement.infrastructure.persistence.repository;

import com.retailmanagement.infrastructure.persistence.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocationRepository extends JpaRepository<Location, UUID> {
    
    List<Location> findByTenantId(UUID tenantId);
    
    List<Location> findByTenantIdAndLocationType(UUID tenantId, Location.LocationType locationType);
    
    Optional<Location> findByIdAndTenantId(UUID id, UUID tenantId);
    
    Optional<Location> findByTenantIdAndIsDefaultWarehouseTrue(UUID tenantId);
    
    boolean existsByCodeAndTenantId(String code, UUID tenantId);
}
