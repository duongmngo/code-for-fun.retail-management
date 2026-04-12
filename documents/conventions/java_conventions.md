# Java Backend - Coding Conventions & Project Structure

## Document Information
- **Version**: 1.0
- **Last Updated**: January 25, 2026
- **Applies To**: retail-management-api

---

## 1. Project Structure

```
retail-management-api/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd-staging.yml
│       └── cd-production.yml
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.local.yml
├── docs/
│   └── api/
│       └── openapi.yaml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── retailmanagement/
│   │   │           ├── RetailManagementApplication.java
│   │   │           │
│   │   │           ├── common/                    # Shared components
│   │   │           │   ├── annotation/            # Custom annotations
│   │   │           │   ├── aspect/                # AOP aspects
│   │   │           │   ├── config/                # Configuration classes
│   │   │           │   ├── constant/              # Constants
│   │   │           │   ├── exception/             # Global exceptions
│   │   │           │   ├── filter/                # Servlet filters
│   │   │           │   ├── security/              # Security components
│   │   │           │   └── util/                  # Utility classes
│   │   │           │
│   │   │           ├── infrastructure/            # Infrastructure layer
│   │   │           │   ├── persistence/           # Database related
│   │   │           │   │   ├── entity/            # JPA entities
│   │   │           │   │   ├── repository/        # JPA repositories
│   │   │           │   │   └── specification/     # JPA specifications
│   │   │           │   ├── messaging/             # Message queue
│   │   │           │   ├── cache/                 # Caching
│   │   │           │   └── external/              # External API clients
│   │   │           │
│   │   │           └── module/                    # Feature modules
│   │   │               │
│   │   │               ├── tenant/                # Tenant module
│   │   │               │   ├── controller/
│   │   │               │   │   └── TenantController.java
│   │   │               │   ├── service/
│   │   │               │   │   ├── TenantService.java
│   │   │               │   │   └── impl/
│   │   │               │   │       └── TenantServiceImpl.java
│   │   │               │   ├── dto/
│   │   │               │   │   ├── request/
│   │   │               │   │   │   └── CreateTenantRequest.java
│   │   │               │   │   └── response/
│   │   │               │   │       └── TenantResponse.java
│   │   │               │   ├── mapper/
│   │   │               │   │   └── TenantMapper.java
│   │   │               │   └── validator/
│   │   │               │       └── TenantValidator.java
│   │   │               │
│   │   │               ├── branch/                # Branch module
│   │   │               │   └── ... (same structure)
│   │   │               │
│   │   │               ├── user/                  # User module
│   │   │               │   └── ... (same structure)
│   │   │               │
│   │   │               ├── product/               # Product module
│   │   │               │   └── ... (same structure)
│   │   │               │
│   │   │               ├── inventory/             # Inventory module
│   │   │               │   └── ... (same structure)
│   │   │               │
│   │   │               ├── sales/                 # Sales/POS module
│   │   │               │   └── ... (same structure)
│   │   │               │
│   │   │               ├── report/                # Reporting module
│   │   │               │   └── ... (same structure)
│   │   │               │
│   │   │               └── sync/                  # Sync module
│   │   │                   └── ... (same structure)
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-local.yml
│   │       ├── application-dev.yml
│   │       ├── application-staging.yml
│   │       ├── application-prod.yml
│   │       ├── db/
│   │       │   └── migration/                     # Flyway migrations
│   │       │       ├── V1__init_schema.sql
│   │       │       └── V2__seed_data.sql
│   │       └── messages/
│   │           ├── messages.properties
│   │           └── messages_vi.properties
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── retailmanagement/
│                   ├── integration/               # Integration tests
│                   ├── unit/                      # Unit tests
│                   └── e2e/                       # End-to-end tests
│
├── .gitignore
├── .editorconfig
├── build.gradle (or pom.xml)
├── settings.gradle
├── checkstyle.xml
├── lombok.config
└── README.md
```

---

## 2. Module Structure Guidelines

### 2.1 Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Module Layer Architecture                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    Controller Layer                              │   │
│   │  - REST API endpoints                                            │   │
│   │  - Request/Response handling                                     │   │
│   │  - Input validation                                              │   │
│   │  - OpenAPI documentation                                         │   │
│   └────────────────────────────┬────────────────────────────────────┘   │
│                                │                                         │
│                                ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     Service Layer                                │   │
│   │  - Business logic                                                │   │
│   │  - Transaction management                                        │   │
│   │  - Authorization checks                                          │   │
│   │  - Event publishing                                              │   │
│   └────────────────────────────┬────────────────────────────────────┘   │
│                                │                                         │
│                                ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                   Repository Layer                               │   │
│   │  - Data access                                                   │   │
│   │  - JPA repositories                                              │   │
│   │  - Custom queries                                                │   │
│   │  - Specifications                                                │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
Request → Controller → DTO → Mapper → Service → Entity → Repository → Database
                                         │
Response ← Controller ← DTO ← Mapper ← Service ← Entity ← Repository ← Database
```

---

## 3. Naming Conventions

### 3.1 Package Naming
```java
// Base package
com.retailmanagement

// Module packages
com.retailmanagement.module.{module_name}
com.retailmanagement.module.product
com.retailmanagement.module.inventory

// Common packages
com.retailmanagement.common.{component_type}
com.retailmanagement.common.exception
com.retailmanagement.common.util
```

### 3.2 Class Naming

| Type | Convention | Example |
|------|------------|---------|
| Entity | PascalCase, singular noun | `Product`, `SaleTransaction` |
| Repository | {Entity}Repository | `ProductRepository` |
| Service Interface | {Entity}Service | `ProductService` |
| Service Implementation | {Entity}ServiceImpl | `ProductServiceImpl` |
| Controller | {Entity}Controller | `ProductController` |
| DTO Request | {Action}{Entity}Request | `CreateProductRequest` |
| DTO Response | {Entity}Response | `ProductResponse` |
| Mapper | {Entity}Mapper | `ProductMapper` |
| Exception | {Description}Exception | `ProductNotFoundException` |
| Validator | {Entity}Validator | `ProductValidator` |
| Specification | {Entity}Specification | `ProductSpecification` |
| Config | {Feature}Config | `SecurityConfig` |
| Constant | {Feature}Constants | `AppConstants` |

### 3.3 Method Naming

```java
// Service methods
public interface ProductService {
    // Create
    ProductResponse createProduct(CreateProductRequest request);
    
    // Read
    ProductResponse getProductById(UUID id);
    ProductResponse getProductByBarcode(String barcode);
    Page<ProductResponse> getProducts(ProductFilter filter, Pageable pageable);
    List<ProductResponse> getAllProducts();
    
    // Update
    ProductResponse updateProduct(UUID id, UpdateProductRequest request);
    
    // Delete
    void deleteProduct(UUID id);
    
    // Business operations
    void adjustStock(UUID productId, StockAdjustmentRequest request);
    boolean isBarcodeDuplicate(String barcode);
}

// Repository methods (Spring Data JPA conventions)
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByCategory(Category category);
    List<Product> findByCategoryIdAndActiveTrue(UUID categoryId);
    boolean existsByBarcodeAndTenantId(String barcode, UUID tenantId);
    
    @Query("SELECT p FROM Product p WHERE p.stock < p.reorderLevel")
    List<Product> findLowStockProducts();
}
```

### 3.4 Variable Naming

```java
// Local variables - camelCase
String productName = "Widget";
int stockQuantity = 100;
List<Product> activeProducts = new ArrayList<>();

// Constants - UPPER_SNAKE_CASE
public static final String DEFAULT_CURRENCY = "VND";
public static final int MAX_PRODUCTS_PER_PAGE = 100;
private static final Logger LOG = LoggerFactory.getLogger(ProductService.class);

// Boolean variables - use is/has/can prefix
boolean isActive = true;
boolean hasStock = quantity > 0;
boolean canEdit = user.hasPermission("PRODUCT_EDIT");
```

---

## 4. Code Style Guidelines

### 4.1 Entity Best Practices

```java
package com.retailmanagement.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_barcode", columnList = "barcode"),
    @Index(name = "idx_product_tenant", columnList = "tenant_id"),
    @Index(name = "idx_product_category", columnList = "category_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "sku", length = 50)
    private String sku;

    @Column(name = "barcode", length = 100)
    private String barcode;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "cost_price", precision = 15, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "selling_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    @Column(name = "reorder_level")
    @Builder.Default
    private Integer reorderLevel = 10;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ProductImage> images = new HashSet<>();

    // Helper methods
    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }

    public boolean isLowStock() {
        return stockQuantity != null && reorderLevel != null 
            && stockQuantity <= reorderLevel;
    }
}
```

### 4.2.1 Location Entity (Warehouse/Branch)

```java
package com.retailmanagement.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "locations", indexes = {
    @Index(name = "idx_location_tenant", columnList = "tenant_id"),
    @Index(name = "idx_location_type", columnList = "location_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 50)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "location_type", nullable = false, length = 20)
    private LocationType locationType;

    @Column(name = "is_default_warehouse")
    @Builder.Default
    private Boolean isDefaultWarehouse = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Location parent; // For branch, this points to default warehouse

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public enum LocationType {
        WAREHOUSE,  // Storage only, doesn't sell to customers
        BRANCH      // Sells to customers
    }

    public boolean isWarehouse() {
        return LocationType.WAREHOUSE.equals(locationType);
    }

    public boolean isBranch() {
        return LocationType.BRANCH.equals(locationType);
    }
}
```

### 4.2.2 Material Entity

```java
package com.retailmanagement.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "materials", indexes = {
    @Index(name = "idx_material_tenant", columnList = "tenant_id"),
    @Index(name = "idx_material_sku", columnList = "sku"),
    @Index(name = "idx_material_category", columnList = "category_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "sku", length = 50)
    private String sku;

    @Column(name = "barcode", length = 100)
    private String barcode;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_of_measure", nullable = false, length = 20)
    private UnitOfMeasure unitOfMeasure;

    @Column(name = "cost_price", precision = 15, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "reorder_level")
    @Builder.Default
    private Integer reorderLevel = 10;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private MaterialCategory category;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public enum UnitOfMeasure {
        KILOGRAM("kg"),
        GRAM("g"),
        LITER("L"),
        MILLILITER("mL"),
        PIECE("pc"),
        PACK("pack"),
        BOX("box");

        private final String symbol;

        UnitOfMeasure(String symbol) {
            this.symbol = symbol;
        }

        public String getSymbol() {
            return symbol;
        }
    }
}
```

### 4.2.3 Material Inventory Entity

```java
@Entity
@Table(name = "material_inventory", indexes = {
    @Index(name = "idx_mat_inv_material", columnList = "material_id"),
    @Index(name = "idx_mat_inv_location", columnList = "location_id")
}, uniqueConstraints = {
    @UniqueConstraint(columnNames = {"material_id", "location_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialInventory extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "quantity", nullable = false, precision = 15, scale = 3)
    private BigDecimal quantity;

    @Column(name = "reserved_quantity", precision = 15, scale = 3)
    @Builder.Default
    private BigDecimal reservedQuantity = BigDecimal.ZERO;

    public BigDecimal getAvailableQuantity() {
        return quantity.subtract(reservedQuantity);
    }
}
```

### 4.2.4 Transfer Order Entity

```java
@Entity
@Table(name = "transfer_orders", indexes = {
    @Index(name = "idx_transfer_tenant", columnList = "tenant_id"),
    @Index(name = "idx_transfer_from", columnList = "from_location_id"),
    @Index(name = "idx_transfer_to", columnList = "to_location_id"),
    @Index(name = "idx_transfer_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferOrder extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "transfer_number", nullable = false, unique = true, length = 50)
    private String transferNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_location_id", nullable = false)
    private Location fromLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_location_id", nullable = false)
    private Location toLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TransferStatus status = TransferStatus.PENDING;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by")
    private User requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @OneToMany(mappedBy = "transferOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<TransferItem> items = new HashSet<>();

    public enum TransferStatus {
        PENDING,       // Request created, awaiting approval
        APPROVED,      // Approved by warehouse manager
        IN_TRANSIT,    // Items shipped, in transit
        RECEIVED,      // Items received at destination
        CANCELLED      // Transfer cancelled
    }

    public void addItem(TransferItem item) {
        items.add(item);
        item.setTransferOrder(this);
    }
}

@Entity
@Table(name = "transfer_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferItem extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transfer_order_id", nullable = false)
    private TransferOrder transferOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "requested_quantity", nullable = false, precision = 15, scale = 3)
    private BigDecimal requestedQuantity;

    @Column(name = "shipped_quantity", precision = 15, scale = 3)
    private BigDecimal shippedQuantity;

    @Column(name = "received_quantity", precision = 15, scale = 3)
    private BigDecimal receivedQuantity;

    @Column(name = "notes", length = 500)
    private String notes;
}
```

### 4.2.5 Product Recipe Entity

```java
@Entity
@Table(name = "product_recipes", indexes = {
    @Index(name = "idx_recipe_product", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRecipe extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "yield_quantity", nullable = false)
    @Builder.Default
    private Integer yieldQuantity = 1; // How many products this recipe makes

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<RecipeIngredient> ingredients = new HashSet<>();

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public void addIngredient(RecipeIngredient ingredient) {
        ingredients.add(ingredient);
        ingredient.setRecipe(this);
    }

    public BigDecimal calculateMaterialCost() {
        return ingredients.stream()
            .map(ing -> ing.getMaterial().getCostPrice()
                .multiply(ing.getQuantity()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

@Entity
@Table(name = "recipe_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeIngredient extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private ProductRecipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "quantity", nullable = false, precision = 15, scale = 3)
    private BigDecimal quantity; // Amount per recipe yield
}
```

### 4.2.6 Product Pricing Entities

```java
/**
 * Product sale price with effective date range
 * Supports promotional pricing and scheduled price changes
 */
@Entity
@Table(name = "product_sale_prices", indexes = {
    @Index(name = "idx_sale_price_product", columnList = "product_id"),
    @Index(name = "idx_sale_price_dates", columnList = "start_date, end_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSalePrice extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant; // Null = applies to all variants

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", nullable = false, length = 20)
    private PriceType priceType;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate; // Null = no end date

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public enum PriceType {
        COST,           // Import/purchase price
        REGULAR,        // Standard selling price
        SALE,           // Promotional/sale price
        MEMBER,         // Member/loyalty price
        WHOLESALE       // Bulk/wholesale price
    }

    public boolean isCurrentlyActive() {
        LocalDateTime now = LocalDateTime.now();
        boolean afterStart = !now.isBefore(startDate);
        boolean beforeEnd = endDate == null || !now.isAfter(endDate);
        return isActive && afterStart && beforeEnd;
    }
}

/**
 * Branch-specific price override
 * Allows different pricing per branch
 */
@Entity
@Table(name = "branch_price_overrides", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "branch_id", "price_type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchPriceOverride extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Location branch;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", nullable = false, length = 20)
    private ProductSalePrice.PriceType priceType;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}

/**
 * Price history for audit trail
 */
@Entity
@Table(name = "product_price_history", indexes = {
    @Index(name = "idx_price_history_product", columnList = "product_id"),
    @Index(name = "idx_price_history_changed_at", columnList = "changed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPriceHistory extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "variant_id")
    private UUID variantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", nullable = false, length = 20)
    private ProductSalePrice.PriceType priceType;

    @Column(name = "old_price", precision = 15, scale = 2)
    private BigDecimal oldPrice;

    @Column(name = "new_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal newPrice;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @Column(name = "changed_by")
    private UUID changedBy;

    @Column(name = "reason", length = 500)
    private String reason;
}
```

### 4.2.7 Tenant Payment Configuration Entity

```java
@Entity
@Table(name = "tenant_payment_configs", indexes = {
    @Index(name = "idx_payment_config_tenant", columnList = "tenant_id")
}, uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "payment_method", "provider"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantPaymentConfig extends BaseEntity {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "provider", length = 50)
    private String provider; // e.g., VNPAY, MOMO, STRIPE

    @Column(name = "display_name", length = 100)
    private String displayName;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_enabled", nullable = false)
    @Builder.Default
    private Boolean isEnabled = true;

    @Convert(converter = EncryptedJsonConverter.class)
    @Column(name = "configuration", columnDefinition = "TEXT")
    private Map<String, String> configuration; // Encrypted API keys, etc.

    @Enumerated(EnumType.STRING)
    @Column(name = "environment", length = 20)
    @Builder.Default
    private Environment environment = Environment.SANDBOX;

    public enum PaymentMethod {
        CASH,
        BANK_TRANSFER,
        CARD,
        MOBILE_PAYMENT,
        QR_CODE,
        EWALLET,
        STORE_CREDIT,
        GIFT_CARD
    }

    public enum Environment {
        SANDBOX,
        PRODUCTION
    }
}
```

### 4.2.8 Service Examples for Material & Transfer

```java
package com.retailmanagement.module.inventory.service.impl;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TransferOrderServiceImpl implements TransferOrderService {

    private final TransferOrderRepository transferOrderRepository;
    private final MaterialInventoryRepository materialInventoryRepository;
    private final TransferOrderMapper mapper;
    private final TenantContext tenantContext;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public TransferOrderResponse createTransferRequest(CreateTransferRequest request) {
        log.info("Creating transfer request from {} to {}", 
            request.getFromLocationId(), request.getToLocationId());

        UUID tenantId = tenantContext.getCurrentTenantId();
        
        TransferOrder order = TransferOrder.builder()
            .tenantId(tenantId)
            .transferNumber(generateTransferNumber())
            .fromLocation(Location.builder().id(request.getFromLocationId()).build())
            .toLocation(Location.builder().id(request.getToLocationId()).build())
            .status(TransferOrder.TransferStatus.PENDING)
            .requestedAt(LocalDateTime.now())
            .requestedBy(User.builder().id(tenantContext.getCurrentUserId()).build())
            .build();

        // Add items
        request.getItems().forEach(item -> {
            TransferItem transferItem = TransferItem.builder()
                .material(Material.builder().id(item.getMaterialId()).build())
                .requestedQuantity(item.getQuantity())
                .build();
            order.addItem(transferItem);
        });

        TransferOrder saved = transferOrderRepository.save(order);
        
        // Publish event
        eventPublisher.publishEvent(new TransferRequestedEvent(saved.getId(), tenantId));
        
        return mapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TransferOrderResponse approveTransfer(UUID transferId) {
        TransferOrder order = findTransferById(transferId);
        
        validateStatus(order, TransferOrder.TransferStatus.PENDING);
        
        order.setStatus(TransferOrder.TransferStatus.APPROVED);
        order.setApprovedAt(LocalDateTime.now());
        order.setApprovedBy(User.builder().id(tenantContext.getCurrentUserId()).build());
        
        // Reserve materials at source location
        order.getItems().forEach(item -> {
            reserveMaterial(order.getFromLocation().getId(), 
                item.getMaterial().getId(), 
                item.getRequestedQuantity());
        });
        
        return mapper.toResponse(transferOrderRepository.save(order));
    }

    @Override
    @Transactional
    public TransferOrderResponse shipTransfer(UUID transferId, ShipTransferRequest request) {
        TransferOrder order = findTransferById(transferId);
        
        validateStatus(order, TransferOrder.TransferStatus.APPROVED);
        
        order.setStatus(TransferOrder.TransferStatus.IN_TRANSIT);
        order.setShippedAt(LocalDateTime.now());
        
        // Update shipped quantities and deduct from source
        request.getItems().forEach(item -> {
            TransferItem transferItem = findTransferItem(order, item.getMaterialId());
            transferItem.setShippedQuantity(item.getShippedQuantity());
            
            // Deduct from source inventory
            deductMaterial(order.getFromLocation().getId(),
                item.getMaterialId(),
                item.getShippedQuantity());
        });
        
        eventPublisher.publishEvent(new TransferShippedEvent(order.getId()));
        
        return mapper.toResponse(transferOrderRepository.save(order));
    }

    @Override
    @Transactional
    public TransferOrderResponse receiveTransfer(UUID transferId, ReceiveTransferRequest request) {
        TransferOrder order = findTransferById(transferId);
        
        validateStatus(order, TransferOrder.TransferStatus.IN_TRANSIT);
        
        order.setStatus(TransferOrder.TransferStatus.RECEIVED);
        order.setReceivedAt(LocalDateTime.now());
        
        // Update received quantities and add to destination
        request.getItems().forEach(item -> {
            TransferItem transferItem = findTransferItem(order, item.getMaterialId());
            transferItem.setReceivedQuantity(item.getReceivedQuantity());
            
            // Add to destination inventory
            addMaterial(order.getToLocation().getId(),
                item.getMaterialId(),
                item.getReceivedQuantity());
        });
        
        eventPublisher.publishEvent(new TransferReceivedEvent(order.getId()));
        
        return mapper.toResponse(transferOrderRepository.save(order));
    }

    private void reserveMaterial(UUID locationId, UUID materialId, BigDecimal quantity) {
        MaterialInventory inventory = materialInventoryRepository
            .findByLocationIdAndMaterialId(locationId, materialId)
            .orElseThrow(() -> new BusinessException("MATERIAL_NOT_FOUND", 
                "Material not found at location"));
        
        if (inventory.getAvailableQuantity().compareTo(quantity) < 0) {
            throw new BusinessException("INSUFFICIENT_STOCK", 
                "Not enough material available for transfer");
        }
        
        inventory.setReservedQuantity(inventory.getReservedQuantity().add(quantity));
        materialInventoryRepository.save(inventory);
    }

    private void deductMaterial(UUID locationId, UUID materialId, BigDecimal quantity) {
        MaterialInventory inventory = materialInventoryRepository
            .findByLocationIdAndMaterialId(locationId, materialId)
            .orElseThrow();
        
        inventory.setQuantity(inventory.getQuantity().subtract(quantity));
        inventory.setReservedQuantity(inventory.getReservedQuantity().subtract(quantity));
        materialInventoryRepository.save(inventory);
    }

    private void addMaterial(UUID locationId, UUID materialId, BigDecimal quantity) {
        MaterialInventory inventory = materialInventoryRepository
            .findByLocationIdAndMaterialId(locationId, materialId)
            .orElseGet(() -> MaterialInventory.builder()
                .location(Location.builder().id(locationId).build())
                .material(Material.builder().id(materialId).build())
                .quantity(BigDecimal.ZERO)
                .build());
        
        inventory.setQuantity(inventory.getQuantity().add(quantity));
        materialInventoryRepository.save(inventory);
    }
}
```

### 4.2.9 Service Example for Pricing

```java
package com.retailmanagement.module.product.service.impl;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductPriceServiceImpl implements ProductPriceService {

    private final ProductSalePriceRepository salePriceRepository;
    private final BranchPriceOverrideRepository branchPriceRepository;
    private final ProductPriceHistoryRepository priceHistoryRepository;
    private final TenantContext tenantContext;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Get the effective selling price for a product at a specific branch
     * Priority: 1. Branch override, 2. Active sale price, 3. Regular price
     */
    @Override
    public BigDecimal getEffectivePrice(UUID productId, UUID variantId, UUID branchId) {
        // 1. Check branch-specific override
        Optional<BranchPriceOverride> branchOverride = branchPriceRepository
            .findActiveByProductAndBranch(productId, variantId, branchId, 
                ProductSalePrice.PriceType.REGULAR);
        
        if (branchOverride.isPresent()) {
            return branchOverride.get().getPrice();
        }

        // 2. Check active sale price
        Optional<ProductSalePrice> salePrice = salePriceRepository
            .findActiveByProductAndType(productId, variantId, 
                ProductSalePrice.PriceType.SALE, LocalDateTime.now());
        
        if (salePrice.isPresent()) {
            return salePrice.get().getPrice();
        }

        // 3. Fall back to regular price
        return salePriceRepository
            .findActiveByProductAndType(productId, variantId,
                ProductSalePrice.PriceType.REGULAR, LocalDateTime.now())
            .map(ProductSalePrice::getPrice)
            .orElseThrow(() -> new BusinessException("PRICE_NOT_FOUND",
                "No price configured for product"));
    }

    @Override
    public PriceBreakdown getPriceBreakdown(UUID productId, UUID variantId, UUID branchId) {
        BigDecimal costPrice = salePriceRepository
            .findActiveByProductAndType(productId, variantId,
                ProductSalePrice.PriceType.COST, LocalDateTime.now())
            .map(ProductSalePrice::getPrice)
            .orElse(BigDecimal.ZERO);

        BigDecimal regularPrice = salePriceRepository
            .findActiveByProductAndType(productId, variantId,
                ProductSalePrice.PriceType.REGULAR, LocalDateTime.now())
            .map(ProductSalePrice::getPrice)
            .orElse(BigDecimal.ZERO);

        BigDecimal effectivePrice = getEffectivePrice(productId, variantId, branchId);
        
        BigDecimal discount = regularPrice.subtract(effectivePrice);
        BigDecimal margin = effectivePrice.subtract(costPrice);
        BigDecimal marginPercent = effectivePrice.compareTo(BigDecimal.ZERO) > 0
            ? margin.divide(effectivePrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;

        return PriceBreakdown.builder()
            .costPrice(costPrice)
            .regularPrice(regularPrice)
            .effectivePrice(effectivePrice)
            .discount(discount)
            .grossMargin(margin)
            .grossMarginPercent(marginPercent)
            .build();
    }

    @Override
    @Transactional
    public ProductSalePriceResponse updatePrice(UUID productId, UpdatePriceRequest request) {
        log.info("Updating {} price for product {}", request.getPriceType(), productId);

        // Get current price for history
        Optional<ProductSalePrice> currentPrice = salePriceRepository
            .findActiveByProductAndType(productId, request.getVariantId(),
                request.getPriceType(), LocalDateTime.now());

        // Deactivate current price if exists
        currentPrice.ifPresent(price -> {
            price.setEndDate(LocalDateTime.now());
            salePriceRepository.save(price);
        });

        // Create new price
        ProductSalePrice newPrice = ProductSalePrice.builder()
            .product(Product.builder().id(productId).build())
            .variant(request.getVariantId() != null 
                ? ProductVariant.builder().id(request.getVariantId()).build() 
                : null)
            .priceType(request.getPriceType())
            .price(request.getPrice())
            .startDate(request.getStartDate() != null 
                ? request.getStartDate() 
                : LocalDateTime.now())
            .endDate(request.getEndDate())
            .isActive(true)
            .build();

        ProductSalePrice saved = salePriceRepository.save(newPrice);

        // Record price history
        ProductPriceHistory history = ProductPriceHistory.builder()
            .productId(productId)
            .variantId(request.getVariantId())
            .priceType(request.getPriceType())
            .oldPrice(currentPrice.map(ProductSalePrice::getPrice).orElse(null))
            .newPrice(request.getPrice())
            .changedAt(LocalDateTime.now())
            .changedBy(tenantContext.getCurrentUserId())
            .reason(request.getReason())
            .build();
        priceHistoryRepository.save(history);

        // Publish event
        eventPublisher.publishEvent(new ProductPriceChangedEvent(
            productId, 
            request.getVariantId(),
            currentPrice.map(ProductSalePrice::getPrice).orElse(null),
            request.getPrice()
        ));

        return mapper.toResponse(saved);
    }
}
```

### 4.3 Base Entity

```java
package com.retailmanagement.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class BaseEntity {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;

    @Version
    @Column(name = "version")
    private Long version;
}
```

### 4.3 Controller Best Practices

```java
package com.retailmanagement.module.product.controller;

import com.retailmanagement.module.product.dto.request.*;
import com.retailmanagement.module.product.dto.response.*;
import com.retailmanagement.module.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasAuthority('PRODUCT_CREATE')")
    @Operation(summary = "Create a new product")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "Product created successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(
            @Parameter(description = "Product ID") @PathVariable UUID id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    @Operation(summary = "Get all products with pagination and filtering")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
            @Valid ProductFilterRequest filter,
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        Page<ProductResponse> response = productService.getProducts(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE')")
    @Operation(summary = "Update product")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_DELETE')")
    @Operation(summary = "Delete product")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/barcode/{barcode}")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    @Operation(summary = "Get product by barcode")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductByBarcode(
            @PathVariable String barcode) {
        ProductResponse response = productService.getProductByBarcode(barcode);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
```

### 4.4 Service Best Practices

```java
package com.retailmanagement.module.product.service.impl;

import com.retailmanagement.common.exception.BusinessException;
import com.retailmanagement.common.exception.ResourceNotFoundException;
import com.retailmanagement.common.security.TenantContext;
import com.retailmanagement.infrastructure.persistence.entity.Product;
import com.retailmanagement.infrastructure.persistence.repository.ProductRepository;
import com.retailmanagement.module.product.dto.request.*;
import com.retailmanagement.module.product.dto.response.*;
import com.retailmanagement.module.product.mapper.ProductMapper;
import com.retailmanagement.module.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final TenantContext tenantContext;

    @Override
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse createProduct(CreateProductRequest request) {
        log.info("Creating product with name: {}", request.getName());
        
        UUID tenantId = tenantContext.getCurrentTenantId();
        
        // Validate barcode uniqueness within tenant
        if (request.getBarcode() != null && 
            productRepository.existsByBarcodeAndTenantId(request.getBarcode(), tenantId)) {
            throw new BusinessException("PRODUCT_BARCODE_DUPLICATE", 
                "Barcode already exists: " + request.getBarcode());
        }
        
        Product product = productMapper.toEntity(request);
        product.setTenantId(tenantId);
        
        Product savedProduct = productRepository.save(product);
        log.info("Product created with ID: {}", savedProduct.getId());
        
        return productMapper.toResponse(savedProduct);
    }

    @Override
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(UUID id) {
        log.debug("Fetching product by ID: {}", id);
        
        Product product = findProductById(id);
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse getProductByBarcode(String barcode) {
        log.debug("Fetching product by barcode: {}", barcode);
        
        UUID tenantId = tenantContext.getCurrentTenantId();
        
        Product product = productRepository
            .findByBarcodeAndTenantId(barcode, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "barcode", barcode));
            
        return productMapper.toResponse(product);
    }

    @Override
    public Page<ProductResponse> getProducts(ProductFilterRequest filter, Pageable pageable) {
        log.debug("Fetching products with filter: {}", filter);
        
        UUID tenantId = tenantContext.getCurrentTenantId();
        
        Page<Product> products = productRepository.findAll(
            ProductSpecification.withFilter(filter, tenantId),
            pageable
        );
        
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public ProductResponse updateProduct(UUID id, UpdateProductRequest request) {
        log.info("Updating product with ID: {}", id);
        
        Product product = findProductById(id);
        
        // Validate barcode uniqueness if changed
        if (request.getBarcode() != null && 
            !request.getBarcode().equals(product.getBarcode())) {
            UUID tenantId = tenantContext.getCurrentTenantId();
            if (productRepository.existsByBarcodeAndTenantId(request.getBarcode(), tenantId)) {
                throw new BusinessException("PRODUCT_BARCODE_DUPLICATE", 
                    "Barcode already exists: " + request.getBarcode());
            }
        }
        
        productMapper.updateEntity(product, request);
        Product updatedProduct = productRepository.save(product);
        
        log.info("Product updated with ID: {}", id);
        return productMapper.toResponse(updatedProduct);
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(UUID id) {
        log.info("Deleting product with ID: {}", id);
        
        Product product = findProductById(id);
        
        // Soft delete
        product.setIsActive(false);
        productRepository.save(product);
        
        log.info("Product soft-deleted with ID: {}", id);
    }

    private Product findProductById(UUID id) {
        UUID tenantId = tenantContext.getCurrentTenantId();
        
        return productRepository
            .findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }
}
```

### 4.5 DTO Best Practices

```java
// Request DTO
package com.retailmanagement.module.product.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @Size(max = 50, message = "SKU must not exceed 50 characters")
    private String sku;

    @Size(max = 100, message = "Barcode must not exceed 100 characters")
    private String barcode;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Cost price must be positive")
    @Digits(integer = 13, fraction = 2, message = "Invalid cost price format")
    private BigDecimal costPrice;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Selling price must be positive")
    @Digits(integer = 13, fraction = 2, message = "Invalid selling price format")
    private BigDecimal sellingPrice;

    @Min(value = 0, message = "Initial stock cannot be negative")
    @Builder.Default
    private Integer initialStock = 0;

    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;

    private UUID categoryId;
}

// Response DTO
package com.retailmanagement.module.product.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private String sku;
    private String barcode;
    private String name;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private Integer stockQuantity;
    private Integer reorderLevel;
    private Boolean isActive;
    private Boolean isLowStock;
    private CategoryResponse category;
    private List<ProductImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 4.6 Mapper Best Practices (using MapStruct)

```java
package com.retailmanagement.module.product.mapper;

import com.retailmanagement.infrastructure.persistence.entity.Product;
import com.retailmanagement.module.product.dto.request.*;
import com.retailmanagement.module.product.dto.response.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "stockQuantity", source = "initialStock")
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "images", ignore = true)
    Product toEntity(CreateProductRequest request);

    @Mapping(target = "isLowStock", expression = "java(product.isLowStock())")
    ProductResponse toResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updateEntity(@MappingTarget Product product, UpdateProductRequest request);
}
```

---

## 5. Multi-Tenancy Implementation

### 5.1 Tenant Context

```java
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
```

### 5.2 Tenant Filter

```java
package com.retailmanagement.common.filter;

import com.retailmanagement.common.security.TenantContext;
import com.retailmanagement.common.security.JwtTokenProvider;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(1)
@RequiredArgsConstructor
public class TenantFilter implements Filter {

    private final TenantContext tenantContext;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        try {
            String token = extractToken(httpRequest);
            if (token != null && jwtTokenProvider.validateToken(token)) {
                UUID tenantId = jwtTokenProvider.getTenantIdFromToken(token);
                UUID branchId = jwtTokenProvider.getBranchIdFromToken(token);
                UUID userId = jwtTokenProvider.getUserIdFromToken(token);
                
                tenantContext.setTenantId(tenantId);
                tenantContext.setBranchId(branchId);
                tenantContext.setUserId(userId);
            }
            
            chain.doFilter(request, response);
        } finally {
            tenantContext.clear();
        }
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

## 6. Exception Handling

### 6.1 Custom Exceptions

```java
package com.retailmanagement.common.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final String errorCode;

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}

@Getter
public class ResourceNotFoundException extends RuntimeException {
    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
```

### 6.2 Global Exception Handler

```java
package com.retailmanagement.common.exception;

import com.retailmanagement.module.common.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("RESOURCE_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        log.warn("Business exception: {} - {}", ex.getErrorCode(), ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getErrorCode(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.warn("Validation errors: {}", errors);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error("VALIDATION_ERROR", "Validation failed", errors));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.error("ACCESS_DENIED", "You don't have permission to perform this action"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unexpected error occurred", ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}
```

---

## 7. API Response Format

### 7.1 Standard Response Wrapper

```java
package com.retailmanagement.module.common.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private String errorCode;
    private T data;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
            .success(true)
            .message(message)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }

    public static <T> ApiResponse<T> error(String errorCode, String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .errorCode(errorCode)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }

    public static <T> ApiResponse<T> error(String errorCode, String message, T data) {
        return ApiResponse.<T>builder()
            .success(false)
            .errorCode(errorCode)
            .message(message)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }
}
```

---

## 8. Testing Conventions

### 8.1 Unit Test Example

```java
package com.retailmanagement.unit.module.product.service;

import com.retailmanagement.common.exception.ResourceNotFoundException;
import com.retailmanagement.common.security.TenantContext;
import com.retailmanagement.infrastructure.persistence.entity.Product;
import com.retailmanagement.infrastructure.persistence.repository.ProductRepository;
import com.retailmanagement.module.product.dto.request.CreateProductRequest;
import com.retailmanagement.module.product.dto.response.ProductResponse;
import com.retailmanagement.module.product.mapper.ProductMapper;
import com.retailmanagement.module.product.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Unit Tests")
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private TenantContext tenantContext;

    @InjectMocks
    private ProductServiceImpl productService;

    private UUID tenantId;
    private UUID productId;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        productId = UUID.randomUUID();
        when(tenantContext.getCurrentTenantId()).thenReturn(tenantId);
    }

    @Nested
    @DisplayName("createProduct")
    class CreateProduct {

        @Test
        @DisplayName("should create product successfully")
        void shouldCreateProductSuccessfully() {
            // Given
            CreateProductRequest request = CreateProductRequest.builder()
                .name("Test Product")
                .sellingPrice(BigDecimal.valueOf(100))
                .barcode("1234567890123")
                .build();

            Product product = Product.builder()
                .id(productId)
                .name("Test Product")
                .build();

            ProductResponse expectedResponse = ProductResponse.builder()
                .id(productId)
                .name("Test Product")
                .build();

            when(productRepository.existsByBarcodeAndTenantId(any(), any())).thenReturn(false);
            when(productMapper.toEntity(request)).thenReturn(product);
            when(productRepository.save(any())).thenReturn(product);
            when(productMapper.toResponse(product)).thenReturn(expectedResponse);

            // When
            ProductResponse response = productService.createProduct(request);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(productId);
            assertThat(response.getName()).isEqualTo("Test Product");
            
            verify(productRepository).save(any(Product.class));
        }
    }

    @Nested
    @DisplayName("getProductById")
    class GetProductById {

        @Test
        @DisplayName("should return product when found")
        void shouldReturnProductWhenFound() {
            // Given
            Product product = Product.builder().id(productId).name("Test").build();
            ProductResponse expectedResponse = ProductResponse.builder().id(productId).build();

            when(productRepository.findByIdAndTenantId(productId, tenantId))
                .thenReturn(Optional.of(product));
            when(productMapper.toResponse(product)).thenReturn(expectedResponse);

            // When
            ProductResponse response = productService.getProductById(productId);

            // Then
            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(productId);
        }

        @Test
        @DisplayName("should throw exception when product not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(productRepository.findByIdAndTenantId(productId, tenantId))
                .thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> productService.getProductById(productId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product");
        }
    }
}
```

### 8.2 Integration Test Example

```java
package com.retailmanagement.integration.module.product;

import com.retailmanagement.module.product.dto.request.CreateProductRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("POST /api/v1/products - should create product")
    void shouldCreateProduct() throws Exception {
        String requestBody = """
            {
                "name": "Test Product",
                "sellingPrice": 100.00,
                "barcode": "1234567890123"
            }
            """;

        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + getTestToken())
                .content(requestBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.name").value("Test Product"));
    }
}
```

---

## 9. Database Migration (Flyway)

### 9.1 Migration Naming Convention

```
V{version}__{description}.sql

Examples:
V1__init_schema.sql
V2__create_product_table.sql
V3__add_inventory_table.sql
V4__add_index_product_barcode.sql
```

### 9.2 Migration Example

```sql
-- V1__init_schema.sql

-- Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0
);

-- Branches table
CREATE TABLE branches (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_branch_tenant ON branches(tenant_id);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    parent_id UUID REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_category_tenant ON categories(tenant_id);
CREATE INDEX idx_category_parent ON categories(parent_id);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    category_id UUID REFERENCES categories(id),
    sku VARCHAR(50),
    barcode VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost_price DECIMAL(15, 2),
    selling_price DECIMAL(15, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_product_tenant ON products(tenant_id);
CREATE INDEX idx_product_barcode ON products(barcode);
CREATE INDEX idx_product_category ON products(category_id);
CREATE UNIQUE INDEX idx_product_barcode_tenant ON products(barcode, tenant_id) WHERE barcode IS NOT NULL;
```

---

## 10. Configuration Files

### 10.1 application.yml

```yaml
spring:
  application:
    name: retail-management-api

  profiles:
    active: ${SPRING_PROFILES_ACTIVE:local}

  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:retail_management}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 300000
      pool-name: RetailManagementHikariCP

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        default_batch_fetch_size: 20
    open-in-view: false

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}

  cache:
    type: redis
    redis:
      time-to-live: 3600000

server:
  port: ${SERVER_PORT:8080}
  servlet:
    context-path: /api

# Application specific configs
app:
  jwt:
    secret: ${JWT_SECRET:your-256-bit-secret-key-here}
    expiration: 86400000 # 24 hours
    refresh-expiration: 604800000 # 7 days

  cors:
    allowed-origins: ${CORS_ORIGINS:http://localhost:3000}
    allowed-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
    allowed-headers: "*"
    allow-credentials: true

# Logging
logging:
  level:
    root: INFO
    com.retailmanagement: DEBUG
    org.springframework.security: INFO
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql: TRACE

# Actuator
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when_authorized

# OpenAPI
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
```

---

## 11. Checklist

### 11.1 Code Review Checklist

- [ ] Code follows naming conventions
- [ ] All public methods have proper documentation
- [ ] Input validation is implemented
- [ ] Proper exception handling
- [ ] No hardcoded values (use constants/config)
- [ ] Multi-tenancy is respected
- [ ] Unit tests with good coverage (>80%)
- [ ] No sensitive data in logs
- [ ] Performance considerations (N+1 queries, indexes)
- [ ] Security best practices followed

### 11.2 PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

---

## 12. Related Documents

- [01_product_requirements.md](../spec/01_product_requirements.md) - Product Requirements Document
- [02_future_proof_architecture.md](../spec/02_future_proof_architecture.md) - Future-Proof Architecture Guide
- [react_conventions.md](./react_conventions.md) - React/Next.js Frontend Conventions
