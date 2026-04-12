# Future-Proof Architecture Guide

## Document Information
- **Version**: 1.0
- **Last Updated**: January 25, 2026
- **Status**: Draft

---

## 1. Executive Summary

This document outlines the architectural strategy for building a system that starts as a **Modular Monolith** but is designed for easy extraction to **Microservices** when scale demands it.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Architecture Evolution Path                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Phase 1: Modular Monolith                                                 │
│   ═══════════════════════════                                               │
│   ┌────────────────────────────────────────────────────────────────┐        │
│   │                    Single Deployable Unit                       │        │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │        │
│   │  │ Product  │ │Inventory │ │   POS    │ │ Payment  │          │        │
│   │  │ Module   │ │  Module  │ │  Module  │ │  Module  │          │        │
│   │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │        │
│   │       │            │            │            │                 │        │
│   │       └────────────┴────────────┴────────────┘                 │        │
│   │                         │                                       │        │
│   │                   Shared Database                               │        │
│   └────────────────────────────────────────────────────────────────┘        │
│                                                                              │
│   Phase 2: Hybrid (Extract High-Load Services)                              │
│   ════════════════════════════════════════════                              │
│   ┌─────────────────────────────────────────┐  ┌──────────────────┐        │
│   │           Modular Monolith              │  │ Payment Service  │        │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │ (Extracted)      │        │
│   │  │ Product  │ │Inventory │ │   POS    │ │  └────────┬─────────┘        │
│   │  │ Module   │ │  Module  │ │  Module  │ │           │                  │
│   │  └──────────┘ └──────────┘ └──────────┘ │  ┌────────▼─────────┐        │
│   └────────────────────┬────────────────────┘  │  Payment DB      │        │
│                        │                        └──────────────────┘        │
│                  Main Database                                              │
│                                                                              │
│   Phase 3: Full Microservices                                               │
│   ═══════════════════════════                                               │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│   │ Product  │ │Inventory │ │   POS    │ │ Payment  │ │ Reporting│        │
│   │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │        │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘        │
│        │            │            │            │            │               │
│   ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐        │
│   │Product DB│ │Invent DB │ │  POS DB  │ │Payment DB│ │Report DB │        │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Modular Monolith Design Principles

### 2.1 Module Structure

Each module should be self-contained with clear boundaries:

```
src/
└── main/java/com/retailmanagement/
    ├── common/                     # Shared infrastructure
    │   ├── config/
    │   ├── security/
    │   └── exception/
    │
    └── module/
        ├── product/                # Product Module
        │   ├── api/                # Public interface for other modules
        │   │   ├── ProductModuleApi.java
        │   │   ├── dto/
        │   │   │   ├── ProductDto.java
        │   │   │   └── VariantDto.java
        │   │   └── event/
        │   │       ├── ProductCreatedEvent.java
        │   │       └── ProductUpdatedEvent.java
        │   │
        │   ├── application/        # Application layer (use cases)
        │   │   ├── service/
        │   │   │   ├── ProductService.java
        │   │   │   └── impl/
        │   │   └── mapper/
        │   │
        │   ├── domain/             # Domain layer (entities, rules)
        │   │   ├── entity/
        │   │   ├── repository/     # Repository interfaces
        │   │   └── valueobject/
        │   │
        │   └── infrastructure/     # Infrastructure layer
        │       ├── persistence/    # JPA implementations
        │       ├── messaging/      # Event publishers
        │       └── web/            # REST controllers
        │
        ├── inventory/              # Inventory Module
        │   ├── api/
        │   ├── application/
        │   ├── domain/
        │   └── infrastructure/
        │
        ├── pos/                    # POS/Sales Module
        │   └── ...
        │
        └── payment/                # Payment Module
            └── ...
```

### 2.2 Module Independence Rules

**CRITICAL: These rules enable future microservice extraction**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Module Independence Rules                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Rule 1: NO Cross-Module Database Access                                   │
│   ═══════════════════════════════════════                                   │
│                                                                              │
│   ❌ WRONG: Inventory module directly queries Product table                 │
│   ┌──────────────┐         ┌──────────────┐                                 │
│   │   Inventory  │ ──SQL──►│  Product     │                                 │
│   │   Module     │         │  Table       │                                 │
│   └──────────────┘         └──────────────┘                                 │
│                                                                              │
│   ✅ CORRECT: Inventory calls Product Module API                            │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐       │
│   │   Inventory  │ ──API──►│   Product    │ ──SQL──►│  Product     │       │
│   │   Module     │         │   Module     │         │  Table       │       │
│   └──────────────┘         └──────────────┘         └──────────────┘       │
│                                                                              │
│   Rule 2: Communication via Interfaces Only                                 │
│   ═════════════════════════════════════════                                 │
│                                                                              │
│   Each module exposes a public API interface:                               │
│   - ProductModuleApi.java                                                   │
│   - InventoryModuleApi.java                                                 │
│   - PaymentModuleApi.java                                                   │
│                                                                              │
│   Rule 3: Async Events for Non-Critical Operations                          │
│   ═══════════════════════════════════════════════                           │
│                                                                              │
│   Product Created ──event──► Update Search Index                            │
│   Sale Completed ──event──► Update Reports                                  │
│   Stock Changed ──event──► Check Reorder Level                              │
│                                                                              │
│   Rule 4: Each Module Has Its Own Schema                                    │
│   ══════════════════════════════════════                                    │
│                                                                              │
│   PostgreSQL schemas (same database, different schemas):                    │
│   - product_schema.products                                                 │
│   - inventory_schema.stock_levels                                           │
│   - payment_schema.transactions                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Inter-Module Communication

### 3.1 Synchronous Communication (Module API)

```java
// ========================
// Product Module API
// ========================
package com.retailmanagement.module.product.api;

public interface ProductModuleApi {
    
    /**
     * Get product by ID - used by other modules
     * When extracted to microservice: becomes Feign client
     */
    Optional<ProductDto> getProduct(UUID productId);
    
    /**
     * Get product by barcode - used by POS module
     */
    Optional<ProductDto> getProductByBarcode(String barcode);
    
    /**
     * Get multiple products - batch operation
     */
    List<ProductDto> getProducts(List<UUID> productIds);
    
    /**
     * Check stock availability - used by POS
     */
    boolean checkStockAvailability(UUID productId, UUID branchId, int quantity);
}

// ========================
// Implementation (Monolith)
// ========================
@Service
@RequiredArgsConstructor
public class ProductModuleApiImpl implements ProductModuleApi {
    
    private final ProductRepository productRepository;
    private final ProductMapper mapper;
    
    @Override
    public Optional<ProductDto> getProduct(UUID productId) {
        return productRepository.findById(productId)
            .map(mapper::toDto);
    }
    
    @Override
    public Optional<ProductDto> getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
            .map(mapper::toDto);
    }
}

// ========================
// Future: Feign Client (Microservice)
// ========================
@FeignClient(name = "product-service", fallback = ProductApiFallback.class)
public interface ProductModuleApi {
    
    @GetMapping("/api/v1/products/{productId}")
    Optional<ProductDto> getProduct(@PathVariable UUID productId);
    
    @GetMapping("/api/v1/products/barcode/{barcode}")
    Optional<ProductDto> getProductByBarcode(@PathVariable String barcode);
}
```

### 3.2 Asynchronous Communication (Domain Events)

```java
// ========================
// Domain Events
// ========================
package com.retailmanagement.module.product.api.event;

public record ProductCreatedEvent(
    UUID eventId,
    UUID productId,
    UUID tenantId,
    String name,
    String barcode,
    BigDecimal sellingPrice,
    LocalDateTime occurredAt
) implements DomainEvent {}

public record ProductPriceChangedEvent(
    UUID eventId,
    UUID productId,
    BigDecimal oldPrice,
    BigDecimal newPrice,
    LocalDateTime occurredAt
) implements DomainEvent {}

public record StockLevelChangedEvent(
    UUID eventId,
    UUID productId,
    UUID branchId,
    int oldQuantity,
    int newQuantity,
    String reason,
    LocalDateTime occurredAt
) implements DomainEvent {}

// ========================
// Event Publisher
// ========================
@Component
@RequiredArgsConstructor
public class ProductEventPublisher {
    
    private final ApplicationEventPublisher eventPublisher;
    
    // In monolith: Spring ApplicationEvent
    // In microservice: Kafka/RabbitMQ publisher
    public void publish(DomainEvent event) {
        eventPublisher.publishEvent(event);
    }
}

// ========================
// Event Listener in Another Module
// ========================
@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventListener {
    
    private final StockAlertService stockAlertService;
    
    @EventListener
    @Async // Non-blocking
    public void handleStockLevelChanged(StockLevelChangedEvent event) {
        log.info("Stock changed for product {}: {} -> {}", 
            event.productId(), event.oldQuantity(), event.newQuantity());
        
        // Check if below reorder level
        stockAlertService.checkReorderLevel(event.productId(), event.branchId());
    }
}

// ========================
// Reporting Module Listener
// ========================
@Component
@RequiredArgsConstructor
public class ReportingEventListener {
    
    private final SalesReportService salesReportService;
    
    @EventListener
    @Async
    public void handleSaleCompleted(SaleCompletedEvent event) {
        // Update daily sales report
        salesReportService.recordSale(event);
    }
}
```

---

## 4. Data Isolation Strategy

### 4.1 Schema-Per-Module (PostgreSQL)

```sql
-- Create schemas for each module
CREATE SCHEMA IF NOT EXISTS product_schema;
CREATE SCHEMA IF NOT EXISTS inventory_schema;
CREATE SCHEMA IF NOT EXISTS pos_schema;
CREATE SCHEMA IF NOT EXISTS payment_schema;
CREATE SCHEMA IF NOT EXISTS reporting_schema;

-- Product Module Tables
SET search_path TO product_schema;

CREATE TABLE products (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    -- ... other fields
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    -- ... other fields
);

-- Inventory Module Tables
SET search_path TO inventory_schema;

CREATE TABLE stock_levels (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL, -- NO FK to product_schema!
    branch_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    -- ... other fields
);

-- NOTE: No foreign key to product_schema.products!
-- This enables independent deployment later
```

### 4.2 Data Synchronization Patterns

```java
// ========================
// Product Projection in Inventory Module
// ========================

/**
 * Inventory module maintains its own copy of product data
 * Synced via events - eventual consistency
 */
@Entity
@Table(name = "product_projections", schema = "inventory_schema")
public class ProductProjection {
    
    @Id
    private UUID productId;
    private UUID tenantId;
    private String name;
    private String barcode;
    private boolean active;
    private LocalDateTime lastSyncedAt;
}

/**
 * Listens to product events and updates local projection
 */
@Component
@RequiredArgsConstructor
public class ProductProjectionUpdater {
    
    private final ProductProjectionRepository repository;
    
    @EventListener
    @Transactional
    public void onProductCreated(ProductCreatedEvent event) {
        ProductProjection projection = new ProductProjection();
        projection.setProductId(event.productId());
        projection.setTenantId(event.tenantId());
        projection.setName(event.name());
        projection.setBarcode(event.barcode());
        projection.setActive(true);
        projection.setLastSyncedAt(LocalDateTime.now());
        repository.save(projection);
    }
    
    @EventListener
    @Transactional
    public void onProductUpdated(ProductUpdatedEvent event) {
        repository.findById(event.productId())
            .ifPresent(projection -> {
                projection.setName(event.name());
                projection.setBarcode(event.barcode());
                projection.setLastSyncedAt(LocalDateTime.now());
                repository.save(projection);
            });
    }
}
```

---

## 5. API Design for Future Extraction

### 5.1 REST API Conventions

Design APIs that work both internally (in-process) and externally (HTTP):

```java
// ========================
// Controller (becomes external API when extracted)
// ========================
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(
            @PathVariable UUID id) {
        return ResponseEntity.ok(
            ApiResponse.success(productService.getProduct(id))
        );
    }
    
    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductByBarcode(
            @PathVariable String barcode) {
        return ResponseEntity.ok(
            ApiResponse.success(productService.getProductByBarcode(barcode))
        );
    }
    
    // Batch endpoint for efficient microservice communication
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsBatch(
            @RequestBody List<UUID> productIds) {
        return ResponseEntity.ok(
            ApiResponse.success(productService.getProducts(productIds))
        );
    }
}
```

### 5.2 DTOs at Module Boundaries

```java
// ========================
// Module-level DTOs (API contract)
// ========================
package com.retailmanagement.module.product.api.dto;

/**
 * Immutable DTO for cross-module communication
 * This becomes the API contract when extracting to microservice
 */
public record ProductDto(
    UUID id,
    UUID tenantId,
    String sku,
    String barcode,
    String name,
    BigDecimal sellingPrice,
    BigDecimal costPrice,
    boolean active,
    List<VariantDto> variants
) {}

public record VariantDto(
    UUID id,
    String sku,
    String barcode,
    Map<String, String> options, // e.g., {"Color": "Red", "Size": "M"}
    BigDecimal priceOverride,
    int stockQuantity
) {}
```

---

## 6. Microservice Extraction Checklist

### 6.1 Pre-Extraction Assessment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Module Extraction Readiness Checklist                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   □ Module has clear API interface (ModuleApi)                              │
│   □ No direct database access from other modules                            │
│   □ All cross-module communication via interfaces or events                 │
│   □ Module has its own database schema                                      │
│   □ No @Entity references to other module's entities                        │
│   □ All necessary data available via events or API calls                    │
│   □ Performance acceptable with HTTP calls (batch endpoints exist)          │
│   □ Transaction boundaries don't span modules                               │
│   □ Module can be independently deployed and tested                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Extraction Steps

```
Phase 1: Preparation (while still in monolith)
══════════════════════════════════════════════
1. Ensure module follows all independence rules
2. Add batch API endpoints for efficient communication
3. Implement circuit breaker patterns (Resilience4j)
4. Add correlation IDs for distributed tracing
5. Set up message broker (Kafka/RabbitMQ)

Phase 2: Shadow Mode
════════════════════
1. Deploy new service alongside monolith
2. Route traffic to both (monolith primary)
3. Compare responses for consistency
4. Monitor performance and errors

Phase 3: Gradual Migration
══════════════════════════
1. Switch read operations to new service
2. Migrate write operations
3. Update event publishers to use message broker
4. Decommission module in monolith

Phase 4: Cleanup
════════════════
1. Remove module code from monolith
2. Remove module schema from main database
3. Update documentation
```

---

## 7. ArchUnit Tests for Boundary Enforcement

```java
package com.retailmanagement.architecture;

import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

public class ModuleBoundaryTest {
    
    private static JavaClasses classes;
    
    @BeforeAll
    static void setup() {
        classes = new ClassFileImporter()
            .importPackages("com.retailmanagement");
    }
    
    @Test
    void modules_should_not_access_other_modules_domain_directly() {
        ArchRule rule = noClasses()
            .that().resideInAPackage("..module.inventory..")
            .should().accessClassesThat()
            .resideInAPackage("..module.product.domain..");
        
        rule.check(classes);
    }
    
    @Test
    void modules_should_only_communicate_via_api_package() {
        ArchRule rule = classes()
            .that().resideInAPackage("..module.inventory..")
            .should().onlyAccessClassesThat()
            .resideInAnyPackage(
                "..module.inventory..",      // Own module
                "..module.product.api..",    // Other module's API only
                "..common..",                // Shared
                "java..",                    // JDK
                "jakarta..",                 // Jakarta EE
                "org.springframework..",    // Spring
                "lombok.."                   // Lombok
            );
        
        rule.check(classes);
    }
    
    @Test
    void repository_should_not_reference_other_modules_entities() {
        ArchRule rule = noClasses()
            .that().haveNameMatching(".*Repository")
            .and().resideInAPackage("..module.inventory..")
            .should().dependOnClassesThat()
            .resideInAPackage("..module.product.domain.entity..");
        
        rule.check(classes);
    }
    
    @Test
    void each_module_should_have_layered_architecture() {
        layeredArchitecture()
            .consideringOnlyDependenciesInLayers()
            .layer("API").definedBy("..api..")
            .layer("Application").definedBy("..application..")
            .layer("Domain").definedBy("..domain..")
            .layer("Infrastructure").definedBy("..infrastructure..")
            
            .whereLayer("Infrastructure").mayOnlyBeAccessedByLayers("Application")
            .whereLayer("Application").mayOnlyBeAccessedByLayers("API", "Infrastructure")
            .whereLayer("Domain").mayOnlyBeAccessedByLayers("Application", "Infrastructure")
            
            .check(classes);
    }
}
```

---

## 8. Recommended Extraction Order

Based on business criticality and independence:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Recommended Extraction Order                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. Reporting Module (Lowest Risk)                                         │
│      ─────────────────────────────                                          │
│      - Read-only, no write operations                                       │
│      - Can use CQRS pattern with dedicated read database                    │
│      - Minimal impact if delayed                                            │
│                                                                              │
│   2. Payment Module (Compliance Driven)                                     │
│      ──────────────────────────────                                         │
│      - Often needs to be separate for PCI compliance                        │
│      - Clear boundaries with other modules                                  │
│      - Independent scaling for payment processing                           │
│                                                                              │
│   3. Product Module (Core Service)                                          │
│      ─────────────────────────────                                          │
│      - Most referenced by other modules                                     │
│      - Extract after ensuring event-based sync works                        │
│      - Other modules should use product projections                         │
│                                                                              │
│   4. Inventory Module (High Change Rate)                                    │
│      ────────────────────────────────                                       │
│      - Frequent updates, benefits from independent scaling                  │
│      - Extract after product service is stable                              │
│                                                                              │
│   5. POS Module (Last, Orchestrator)                                        │
│      ───────────────────────────────                                        │
│      - Depends on all other modules                                         │
│      - Extract last after all dependencies are microservices                │
│      - Becomes the API gateway/BFF for frontend                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Technology Recommendations

### 9.1 Current Stack (Monolith)

| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.2+ |
| Language | Java 21 |
| Database | PostgreSQL 16 |
| Cache | Redis |
| Events | Spring ApplicationEvent |
| API Docs | SpringDoc OpenAPI |

### 9.2 Future Stack (Microservices)

| Component | Technology |
|-----------|------------|
| Service Communication | Spring Cloud OpenFeign |
| Service Discovery | Spring Cloud Kubernetes / Consul |
| Message Broker | Apache Kafka / RabbitMQ |
| API Gateway | Spring Cloud Gateway |
| Circuit Breaker | Resilience4j |
| Distributed Tracing | Micrometer + Zipkin/Jaeger |
| Configuration | Spring Cloud Config / Kubernetes ConfigMaps |
| Secrets | HashiCorp Vault / Kubernetes Secrets |

---

## 10. Related Documents

- [01_product_requirements.md](./01_product_requirements.md) - Product Requirements Document
- [java_conventions.md](../conventions/java_conventions.md) - Java Coding Conventions
- [react_conventions.md](../conventions/react_conventions.md) - React/Next.js Conventions
