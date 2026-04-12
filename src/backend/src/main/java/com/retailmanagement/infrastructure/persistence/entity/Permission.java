package com.retailmanagement.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "permissions", indexes = {
    @Index(name = "idx_permission_module", columnList = "module")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "display_name", length = 100)
    private String displayName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "module", length = 50)
    private String module;

    // Permission naming convention: {MODULE}_{ACTION}
    // Examples:
    // PRODUCT_CREATE, PRODUCT_READ, PRODUCT_UPDATE, PRODUCT_DELETE
    // INVENTORY_READ, INVENTORY_ADJUST
    // SALE_CREATE, SALE_READ, SALE_VOID
    // REPORT_VIEW, REPORT_EXPORT
    // USER_MANAGE, ROLE_MANAGE

    // Predefined permission names
    public static final String PRODUCT_CREATE = "PRODUCT_CREATE";
    public static final String PRODUCT_READ = "PRODUCT_READ";
    public static final String PRODUCT_UPDATE = "PRODUCT_UPDATE";
    public static final String PRODUCT_DELETE = "PRODUCT_DELETE";

    public static final String INVENTORY_READ = "INVENTORY_READ";
    public static final String INVENTORY_ADJUST = "INVENTORY_ADJUST";
    public static final String INVENTORY_TRANSFER = "INVENTORY_TRANSFER";

    public static final String SALE_CREATE = "SALE_CREATE";
    public static final String SALE_READ = "SALE_READ";
    public static final String SALE_VOID = "SALE_VOID";
    public static final String SALE_REFUND = "SALE_REFUND";

    public static final String REPORT_VIEW = "REPORT_VIEW";
    public static final String REPORT_EXPORT = "REPORT_EXPORT";

    public static final String USER_CREATE = "USER_CREATE";
    public static final String USER_READ = "USER_READ";
    public static final String USER_UPDATE = "USER_UPDATE";
    public static final String USER_DELETE = "USER_DELETE";

    public static final String ROLE_MANAGE = "ROLE_MANAGE";
    public static final String TENANT_MANAGE = "TENANT_MANAGE";
    public static final String BRANCH_MANAGE = "BRANCH_MANAGE";
}
