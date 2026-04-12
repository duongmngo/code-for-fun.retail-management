package com.retailmanagement.common.security;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.UUID;

@Component
@RequestScope
public class TenantContext {
    
    private UUID tenantId;
    private UUID branchId;
    private UUID userId;

    public UUID getCurrentTenantId() {
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context not initialized");
        }
        return tenantId;
    }

    public UUID getTenantIdOrNull() {
        return tenantId;
    }

    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }

    public UUID getCurrentBranchId() {
        return branchId;
    }

    public void setBranchId(UUID branchId) {
        this.branchId = branchId;
    }

    public UUID getCurrentUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void clear() {
        this.tenantId = null;
        this.branchId = null;
        this.userId = null;
    }
}
