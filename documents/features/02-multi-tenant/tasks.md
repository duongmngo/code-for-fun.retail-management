# Multi-Tenant Module Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 3-4
- **Status**: Not Started
- **Priority**: P0 (Critical)

--- 

## Backend Tasks

### Entities & Database
- [ ] Create Tenant entity:
  - id, name, subdomain (unique)
  - businessName, businessType
  - address, phone, email
  - settings (JSON - currency, timezone, etc.)
  - subscriptionPlan, subscriptionStatus
  - isActive, createdAt, updatedAt
- [ ] Create Location entity:
  - id, tenantId, name, code
  - type (WAREHOUSE | BRANCH)
  - address, phone
  - isDefault (default warehouse)
  - parentId (for warehouse-branch relationship)
  - settings (JSON - tax rate, operating hours)
  - isActive, createdAt, updatedAt
- [ ] Write Flyway migrations

### Tenant Context
- [ ] Create TenantContext (ThreadLocal-based)
  - getCurrentTenantId()
  - getCurrentBranchId()
  - setTenant(tenantId, branchId)
  - clear()
- [ ] Create TenantFilter to extract tenant from JWT
- [ ] Create TenantInterceptor for request scoping

### Multi-Tenant Repository Pattern
- [ ] Create BaseTenantEntity with tenantId
- [ ] Implement JPA specification for tenant filtering
- [ ] Create @TenantAware annotation
- [ ] Implement TenantAwareRepository base class
- [ ] Add Hibernate filter for automatic tenant isolation

### Tenant Service
- [ ] Implement tenant registration (POST /api/v1/tenants)
  - Create tenant
  - Create owner user
  - Create default branch
- [ ] Implement tenant CRUD operations
- [ ] Implement tenant settings update

### Location Service
- [ ] Implement branch CRUD (POST/GET/PUT/DELETE /api/v1/branches)
- [ ] Implement warehouse CRUD (POST/GET/PUT/DELETE /api/v1/warehouses)
- [ ] Implement location listing with type filter
- [ ] Set default warehouse for tenant

### Testing
- [ ] Write unit tests for TenantContext
- [ ] Write tests for tenant isolation
- [ ] Test cross-tenant data access prevention
- [ ] Integration tests for tenant endpoints

---

## Frontend Tasks

### Tenant Registration
- [ ] Create tenant registration flow (/register)
  - Business information form
  - Owner account creation
  - Initial branch setup
- [ ] Create onboarding wizard (optional)

### Branch Management
- [ ] Create branch list page (/settings/branches)
- [ ] Create branch form (create/edit)
- [ ] Implement branch details view
- [ ] Create branch card component

### Warehouse Management
- [ ] Create warehouse list page (/settings/warehouses)
- [ ] Create warehouse form (create/edit)
- [ ] Implement set default warehouse

### Tenant Context Provider
- [ ] Create TenantContext/TenantProvider
- [ ] Implement useTenant hook
- [ ] Create BranchSelector component
- [ ] Implement branch switching functionality
- [ ] Store selected branch in localStorage
- [ ] Sync branch selection with IndexedDB

### Settings
- [ ] Create tenant settings page (/settings)
- [ ] Currency selection
- [ ] Timezone selection
- [ ] Business information edit

### Testing
- [ ] Write tests for TenantProvider
- [ ] Test branch switching
- [ ] E2E test for tenant registration

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/tenants | Register new tenant | No |
| GET | /api/v1/tenants/current | Get current tenant | Yes |
| PUT | /api/v1/tenants/current | Update tenant | Yes (OWNER) |
| GET | /api/v1/branches | List branches | Yes |
| POST | /api/v1/branches | Create branch | Yes (OWNER) |
| GET | /api/v1/branches/{id} | Get branch | Yes |
| PUT | /api/v1/branches/{id} | Update branch | Yes (OWNER/MANAGER) |
| DELETE | /api/v1/branches/{id} | Delete branch | Yes (OWNER) |
| GET | /api/v1/warehouses | List warehouses | Yes |
| POST | /api/v1/warehouses | Create warehouse | Yes (OWNER) |
| PUT | /api/v1/warehouses/{id}/default | Set default warehouse | Yes (OWNER) |

---

## Data Models

### TenantRegistrationRequest
```json
{
  "businessName": "string",
  "subdomain": "string",
  "owner": {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "defaultBranch": {
    "name": "string",
    "address": "string"
  }
}
```

### BranchResponse
```json
{
  "id": "uuid",
  "name": "string",
  "code": "string",
  "type": "BRANCH",
  "address": "string",
  "phone": "string",
  "settings": {
    "taxRate": 10,
    "currency": "VND"
  },
  "isActive": true
}
```

---

## Tenant Isolation Strategy

### Database Level
- All tables have `tenant_id` column
- Hibernate filter auto-applies tenant condition
- Foreign keys include tenant_id where applicable

### Application Level
- TenantContext set from JWT on each request
- Repositories automatically filter by tenant
- Service layer validates tenant access

### Security Considerations
- [ ] Never expose tenant data across tenants
- [ ] Validate tenant ownership on all operations
- [ ] Log tenant context in audit logs
- [ ] Test isolation with multiple tenants

---

## Acceptance Criteria

- [ ] New tenant can register
- [ ] Tenant data is completely isolated
- [ ] User can create/edit/delete branches
- [ ] User can create/edit/delete warehouses
- [ ] Branch switching works correctly
- [ ] Default warehouse can be set
- [ ] Tenant settings can be updated

---

## Dependencies

- **Requires**: 00-project-setup, 01-authentication

## Blocks

- All other modules (need tenant context)
