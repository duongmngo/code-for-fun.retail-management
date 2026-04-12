-- ===========================================
-- Seed Data - Permissions and System Roles
-- ===========================================

-- ===========================================
-- 1. INSERT PERMISSIONS
-- ===========================================

-- Product permissions
INSERT INTO permissions (id, name, display_name, description, module) VALUES
    (gen_random_uuid(), 'PRODUCT_CREATE', 'Create Product', 'Allows creating new products', 'PRODUCT'),
    (gen_random_uuid(), 'PRODUCT_READ', 'View Product', 'Allows viewing product information', 'PRODUCT'),
    (gen_random_uuid(), 'PRODUCT_UPDATE', 'Update Product', 'Allows updating product information', 'PRODUCT'),
    (gen_random_uuid(), 'PRODUCT_DELETE', 'Delete Product', 'Allows deleting products', 'PRODUCT');

-- Inventory permissions
INSERT INTO permissions (id, name, display_name, description, module) VALUES
    (gen_random_uuid(), 'INVENTORY_READ', 'View Inventory', 'Allows viewing inventory levels', 'INVENTORY'),
    (gen_random_uuid(), 'INVENTORY_ADJUST', 'Adjust Inventory', 'Allows adjusting inventory quantities', 'INVENTORY'),
    (gen_random_uuid(), 'INVENTORY_TRANSFER', 'Transfer Inventory', 'Allows transferring inventory between locations', 'INVENTORY');

-- Sales permissions
INSERT INTO permissions (id, name, display_name, description, module) VALUES
    (gen_random_uuid(), 'SALE_CREATE', 'Create Sale', 'Allows creating sales transactions', 'SALES'),
    (gen_random_uuid(), 'SALE_READ', 'View Sales', 'Allows viewing sales history', 'SALES'),
    (gen_random_uuid(), 'SALE_VOID', 'Void Sale', 'Allows voiding sales transactions', 'SALES'),
    (gen_random_uuid(), 'SALE_REFUND', 'Process Refund', 'Allows processing refunds', 'SALES');

-- Report permissions
INSERT INTO permissions (id, name, display_name, description, module) VALUES
    (gen_random_uuid(), 'REPORT_VIEW', 'View Reports', 'Allows viewing reports', 'REPORT'),
    (gen_random_uuid(), 'REPORT_EXPORT', 'Export Reports', 'Allows exporting reports', 'REPORT');

-- User management permissions
INSERT INTO permissions (id, name, display_name, description, module) VALUES
    (gen_random_uuid(), 'USER_CREATE', 'Create User', 'Allows creating new users', 'USER'),
    (gen_random_uuid(), 'USER_READ', 'View Users', 'Allows viewing user information', 'USER'),
    (gen_random_uuid(), 'USER_UPDATE', 'Update User', 'Allows updating user information', 'USER'),
    (gen_random_uuid(), 'USER_DELETE', 'Delete User', 'Allows deleting users', 'USER');

-- Administration permissions
INSERT INTO permissions (id, name, display_name, description, module) VALUES
    (gen_random_uuid(), 'ROLE_MANAGE', 'Manage Roles', 'Allows managing roles and permissions', 'ADMIN'),
    (gen_random_uuid(), 'TENANT_MANAGE', 'Manage Tenant', 'Allows managing tenant settings', 'ADMIN'),
    (gen_random_uuid(), 'BRANCH_MANAGE', 'Manage Branches', 'Allows managing branches and locations', 'ADMIN');

-- ===========================================
-- 2. INSERT SYSTEM ROLES (tenant_id = NULL means system-wide)
-- ===========================================

-- Super Admin (system-wide)
INSERT INTO roles (id, tenant_id, name, display_name, description, is_system_role, is_active) VALUES
    (gen_random_uuid(), NULL, 'SUPER_ADMIN', 'Super Administrator', 'System-wide administrator with full access', TRUE, TRUE);

-- Tenant Admin (template for all tenants)
INSERT INTO roles (id, tenant_id, name, display_name, description, is_system_role, is_active) VALUES
    (gen_random_uuid(), NULL, 'TENANT_ADMIN', 'Tenant Administrator', 'Full access within tenant scope', TRUE, TRUE);

-- Branch Manager
INSERT INTO roles (id, tenant_id, name, display_name, description, is_system_role, is_active) VALUES
    (gen_random_uuid(), NULL, 'BRANCH_MANAGER', 'Branch Manager', 'Manages a specific branch', TRUE, TRUE);

-- Cashier
INSERT INTO roles (id, tenant_id, name, display_name, description, is_system_role, is_active) VALUES
    (gen_random_uuid(), NULL, 'CASHIER', 'Cashier', 'Point of sale operations', TRUE, TRUE);

-- Inventory Staff
INSERT INTO roles (id, tenant_id, name, display_name, description, is_system_role, is_active) VALUES
    (gen_random_uuid(), NULL, 'INVENTORY_STAFF', 'Inventory Staff', 'Inventory management operations', TRUE, TRUE);

-- Viewer
INSERT INTO roles (id, tenant_id, name, display_name, description, is_system_role, is_active) VALUES
    (gen_random_uuid(), NULL, 'VIEWER', 'Viewer', 'Read-only access', TRUE, TRUE);

-- ===========================================
-- 3. ASSIGN PERMISSIONS TO ROLES
-- ===========================================

-- SUPER_ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'SUPER_ADMIN';

-- TENANT_ADMIN gets all permissions (for their tenant)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'TENANT_ADMIN';

-- BRANCH_MANAGER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'BRANCH_MANAGER' 
AND p.name IN (
    'PRODUCT_READ', 'PRODUCT_UPDATE',
    'INVENTORY_READ', 'INVENTORY_ADJUST', 'INVENTORY_TRANSFER',
    'SALE_CREATE', 'SALE_READ', 'SALE_VOID', 'SALE_REFUND',
    'REPORT_VIEW', 'REPORT_EXPORT',
    'USER_READ'
);

-- CASHIER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'CASHIER' 
AND p.name IN (
    'PRODUCT_READ',
    'INVENTORY_READ',
    'SALE_CREATE', 'SALE_READ'
);

-- INVENTORY_STAFF permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'INVENTORY_STAFF' 
AND p.name IN (
    'PRODUCT_READ', 'PRODUCT_UPDATE',
    'INVENTORY_READ', 'INVENTORY_ADJUST', 'INVENTORY_TRANSFER'
);

-- VIEWER permissions (read-only)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'VIEWER' 
AND p.name IN (
    'PRODUCT_READ',
    'INVENTORY_READ',
    'SALE_READ',
    'REPORT_VIEW'
);
