# Backend Interview Preparation


## 0. Spring Framework vs Spring Boot vs J2EE (Jakarta EE)

### Answer
J2EE (now Jakarta EE) is a specification for enterprise Java applications requiring application servers. Spring Framework is a comprehensive programming model that simplifies J2EE development. Spring Boot is an opinionated layer on top of Spring that provides auto-configuration and embedded servers for rapid development.

### Comparison Table

| Aspect | J2EE / Jakarta EE | Spring Framework | Spring Boot |
|--------|------------------|------------------|-------------|
| Type | Specification | Framework | Framework (opinionated Spring) |
| Configuration | XML-heavy, annotations | XML or Java config | Auto-configuration (convention over config) |
| Server | Requires app server (WildFly, WebLogic) | Runs on servlet container | Embedded server (Tomcat, Jetty) |
| Startup Time | Slow (full app server) | Medium | Fast |
| Learning Curve | Steep | Medium | Easy |
| Boilerplate | High | Medium | Low |
| Deployment | WAR/EAR to app server | WAR or standalone | JAR with embedded server |
| Microservices | Not designed for | Possible but manual | Built-in support |

### Key Points
- **J2EE/Jakarta EE**: Original enterprise Java spec. Heavy, requires full application servers. Includes EJB, JPA, JMS, JAX-RS, CDI
- **Spring Framework**: Lightweight alternative to J2EE. IoC container, AOP, transaction management. More flexible configuration
- **Spring Boot**: Spring + auto-configuration + embedded server. "Just run" philosophy. Ideal for microservices

### Historical Evolution

```
J2EE (1999) → Java EE (2006) → Jakarta EE (2017, Eclipse Foundation)
                    ↓
           Spring Framework (2002) - Response to J2EE complexity
                    ↓
              Spring Boot (2014) - Simplified Spring development
```

### Code Comparison

```java
// J2EE: EJB Stateless Session Bean (verbose)
@Stateless
public class OrderServiceEJB {
    @PersistenceContext
    private EntityManager em;
    
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public Order createOrder(OrderDTO dto) {
        Order order = new Order();
        // manual mapping...
        em.persist(order);
        return order;
    }
}

// Spring Framework (still requires XML or explicit config)
@Service
@Transactional
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    
    public Order createOrder(CreateOrderRequest request) {
        return orderRepository.save(Order.from(request));
    }
}

// Spring Boot (auto-configured, minimal setup)
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;  // Constructor injection
    
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        return orderRepository.save(Order.from(request));
    }
}
```

### When to Use Each

| Use Case | Best Choice |
|----------|-------------|
| Legacy enterprise system | J2EE / Jakarta EE |
| Complex enterprise with existing infra | Spring Framework |
| New microservices | Spring Boot |
| Rapid prototyping | Spring Boot |
| Cloud-native applications | Spring Boot |
| Need full control over config | Spring Framework |

### Senior Insight
- Migration path: J2EE → Spring → Spring Boot is common
- Spring Boot doesn't replace Spring; it simplifies it
- Jakarta EE 9+ is modernizing (CDI, JSON-B, JAX-RS) but Spring ecosystem is dominant
- Consider Spring Boot for greenfield; Spring Framework for gradual migration

---

## 1. Java & Spring Boot

### Answer
I use Spring Boot to build RESTful services, leveraging dependency injection, auto-configuration, and profiles. I typically structure applications using controller-service-repository layers.

### Key Points
- Dependency Injection (constructor-based)
- Auto-configuration
- Profiles (dev, prod)

### Senior Insight
- Apply clean/hexagonal architecture
- Standardize logging and exception handling

### Code Example: Constructor-based Dependency Injection

```java
@Service
@RequiredArgsConstructor // Lombok generates constructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;
    private final NotificationService notificationService;
    
    public Order createOrder(CreateOrderRequest request) {
        Order order = Order.builder()
            .customerId(request.getCustomerId())
            .items(request.getItems())
            .status(OrderStatus.PENDING)
            .build();
        
        return orderRepository.save(order);
    }
}
```

### Code Example: Profile-based Configuration

```yaml
# application.yml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:postgresql://localhost:5432/retail_dev
    
---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:postgresql://${DB_HOST}:5432/retail_prod
```

### Code Example: Clean/Hexagonal Architecture

```
src/main/java/com/company/
├── domain/                    # Core business logic (no framework dependencies)
│   ├── model/
│   │   └── Order.java
│   ├── port/
│   │   ├── in/               # Input ports (use cases)
│   │   │   └── CreateOrderUseCase.java
│   │   └── out/              # Output ports (repositories, external services)
│   │       └── OrderRepository.java
│   └── service/
│       └── OrderDomainService.java
├── application/              # Use case implementations
│   └── CreateOrderUseCaseImpl.java
├── adapter/                  # Infrastructure adapters
│   ├── in/
│   │   └── web/
│   │       └── OrderController.java
│   └── out/
│       └── persistence/
│           ├── OrderJpaRepository.java
│           └── OrderPersistenceAdapter.java
```

### Hexagonal Architecture Deep Dive

#### What is Hexagonal Architecture?

**Hexagonal Architecture** (also called **Ports and Adapters**), coined by Alistair Cockburn, is a software design pattern that isolates the core business logic from external concerns like databases, APIs, UI, and third-party services.

The name "hexagonal" comes from the visual representation—a hexagon with the domain at the center, surrounded by ports (interfaces) and adapters (implementations).

#### Visual Representation

```
                    ┌─────────────────────────────────────────┐
                    │           External World                │
                    │  (UI, REST API, CLI, Message Queue)     │
                    └─────────────────┬───────────────────────┘
                                      │
                                ┌─────▼─────┐
                                │  Adapters │  ← Driving (Primary)
                                │  (Input)  │     Controllers, CLI, GraphQL
                                └─────┬─────┘
                                      │
                                ┌─────▼─────┐
                                │   Ports   │  ← Interfaces (Use Cases)
                                │  (Input)  │     Service interfaces
                                └─────┬─────┘
                                      │
                  ┌───────────────────▼───────────────────┐
                  │                                       │
                  │          DOMAIN / CORE                │  ← Pure business logic
                  │        (Business Logic)               │     No external dependencies
                  │                                       │
                  │   • Entities (Order, Product, User)   │
                  │   • Value Objects (Money, Address)    │
                  │   • Domain Services                   │
                  │   • Domain Events                     │
                  │                                       │
                  └───────────────────┬───────────────────┘
                                      │
                                ┌─────▼─────┐
                                │   Ports   │  ← Interfaces (Repository, Gateway)
                                │  (Output) │     Repository interfaces
                                └─────┬─────┘
                                      │
                                ┌─────▼─────┐
                                │  Adapters │  ← Driven (Secondary)
                                │  (Output) │     JPA, Redis, HTTP Client
                                └─────┬─────┘
                                      │
                    ┌─────────────────▼───────────────────────┐
                    │           External World                │
                    │  (Database, Redis, External APIs, S3)   │
                    └─────────────────────────────────────────┘
```

#### Key Components Explained

| Component | Description | Examples |
|-----------|-------------|----------|
| **Domain/Core** | Pure business logic, entities, and rules. Has NO dependencies on frameworks or infrastructure. | `Order`, `Product`, `PricingService`, `DiscountRule` |
| **Ports (Input/Driving)** | Interfaces that the application exposes. Define what the application CAN DO. | `CreateOrderUseCase`, `AuthService`, `PaymentProcessor` |
| **Ports (Output/Driven)** | Interfaces that the application NEEDS. Define what external services it depends on. | `OrderRepository`, `PaymentGateway`, `NotificationSender` |
| **Adapters (Input/Primary)** | Implementations that DRIVE the application. Convert external requests to domain calls. | `OrderController`, `OrderGraphQLResolver`, `OrderKafkaConsumer` |
| **Adapters (Output/Secondary)** | Implementations that ARE DRIVEN by the application. Fulfill output port contracts. | `OrderJpaRepository`, `StripePaymentGateway`, `SmtpNotificationSender` |

#### The Dependency Rule

**Dependencies point INWARD only:**

```
Adapters → Ports → Domain

✅ Controller depends on UseCase interface
✅ UseCase depends on Repository interface
✅ JpaRepository implements Repository interface
❌ Domain NEVER depends on adapters or frameworks
```

This means:
- You can swap PostgreSQL for MongoDB without touching business logic
- You can replace REST with GraphQL without changing domain code
- You can test business logic without databases or HTTP

#### Benefits of Hexagonal Architecture

| Benefit | Description |
|---------|-------------|
| **Testability** | Core logic can be tested with mock adapters—no real DB or HTTP needed |
| **Flexibility** | Swap databases, frameworks, or external services without changing business logic |
| **Independence** | Domain is pure Java/Kotlin—no Spring annotations polluting your models |
| **Clear Boundaries** | Easy to understand what belongs where; enforces separation of concerns |
| **Parallel Development** | Teams can work on adapters independently once ports are defined |
| **Delayed Decisions** | Choose database or framework later; focus on business logic first |

#### Code Example: Complete Implementation

**1. Domain Layer (Core)**

```java
// Domain Entity - Pure Java, no framework dependencies
public class Order {
    private OrderId id;
    private CustomerId customerId;
    private List<OrderItem> items;
    private Money totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    
    // Business logic lives here
    public void addItem(Product product, int quantity) {
        if (status != OrderStatus.DRAFT) {
            throw new OrderNotModifiableException("Cannot modify non-draft order");
        }
        items.add(new OrderItem(product.getId(), quantity, product.getPrice()));
        recalculateTotal();
    }
    
    public void submit() {
        if (items.isEmpty()) {
            throw new EmptyOrderException("Cannot submit empty order");
        }
        this.status = OrderStatus.PENDING;
    }
    
    private void recalculateTotal() {
        this.totalAmount = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(Money.ZERO, Money::add);
    }
}

// Value Object - Immutable
public record Money(BigDecimal amount, Currency currency) {
    public static final Money ZERO = new Money(BigDecimal.ZERO, Currency.USD);
    
    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new CurrencyMismatchException("Cannot add different currencies");
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }
}
```

**2. Input Port (Use Case Interface)**

```java
// What the application CAN DO
public interface CreateOrderUseCase {
    OrderId execute(CreateOrderCommand command);
}

// Command object - input data
public record CreateOrderCommand(
    CustomerId customerId,
    List<OrderItemCommand> items,
    ShippingAddress shippingAddress
) {}
```

**3. Output Port (Repository Interface)**

```java
// What the application NEEDS
public interface OrderRepository {
    Order findById(OrderId id);
    Order save(Order order);
    List<Order> findByCustomerId(CustomerId customerId);
}

public interface PaymentGateway {
    PaymentResult processPayment(Order order, PaymentDetails details);
}
```

**4. Application Layer (Use Case Implementation)**

```java
@UseCase  // Custom annotation (optional)
@RequiredArgsConstructor
public class CreateOrderUseCaseImpl implements CreateOrderUseCase {
    
    private final OrderRepository orderRepository;      // Output port
    private final ProductRepository productRepository;  // Output port
    private final EventPublisher eventPublisher;        // Output port
    
    @Override
    @Transactional
    public OrderId execute(CreateOrderCommand command) {
        // 1. Create domain object
        Order order = Order.createDraft(command.customerId());
        
        // 2. Add items with business validation
        for (OrderItemCommand item : command.items()) {
            Product product = productRepository.findById(item.productId());
            order.addItem(product, item.quantity());
        }
        
        // 3. Submit order (business rule)
        order.submit();
        
        // 4. Persist via output port
        Order savedOrder = orderRepository.save(order);
        
        // 5. Publish domain event
        eventPublisher.publish(new OrderCreatedEvent(savedOrder));
        
        return savedOrder.getId();
    }
}
```

**5. Input Adapter (REST Controller)**

```java
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final CreateOrderUseCase createOrderUseCase;  // Depends on PORT, not impl
    private final GetOrderUseCase getOrderUseCase;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        // Convert HTTP request to domain command
        CreateOrderCommand command = new CreateOrderCommand(
            new CustomerId(request.getCustomerId()),
            request.getItems().stream()
                .map(i -> new OrderItemCommand(new ProductId(i.getProductId()), i.getQuantity()))
                .toList(),
            ShippingAddress.from(request.getShippingAddress())
        );
        
        // Execute use case
        OrderId orderId = createOrderUseCase.execute(command);
        
        // Convert domain result to HTTP response
        return ResponseEntity
            .created(URI.create("/api/v1/orders/" + orderId.value()))
            .body(new OrderResponse(orderId.value()));
    }
}
```

**6. Output Adapter (JPA Repository)**

```java
@Repository
@RequiredArgsConstructor
public class OrderJpaAdapter implements OrderRepository {
    
    private final OrderJpaRepository jpaRepository;  // Spring Data JPA
    private final OrderMapper mapper;
    
    @Override
    public Order findById(OrderId id) {
        return jpaRepository.findById(id.value())
            .map(mapper::toDomain)
            .orElseThrow(() -> new OrderNotFoundException(id));
    }
    
    @Override
    public Order save(Order order) {
        OrderEntity entity = mapper.toEntity(order);
        OrderEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
}

// JPA Entity (infrastructure concern, separate from domain)
@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    private UUID id;
    private UUID customerId;
    private BigDecimal totalAmount;
    private String status;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItemEntity> items;
}
```

#### Hexagonal vs Layered Architecture

| Aspect | Traditional Layered | Hexagonal |
|--------|---------------------|-----------|
| **Dependencies** | Top-down (Controller→Service→Repository) | Outside-in (Adapters→Ports→Domain) |
| **Domain Location** | Middle layer, contaminated by framework | Center, pure and isolated |
| **Testing** | Requires mocking frameworks | Easy mocking with plain interfaces |
| **Framework Coupling** | High (Spring annotations everywhere) | Low (domain has no annotations) |
| **Flexibility** | Hard to swap infrastructure | Easy to swap adapters |

#### When to Use Hexagonal Architecture

**Use it when:**
- Building complex domain logic that changes frequently
- You need high testability
- You want to delay infrastructure decisions
- Multiple input channels (REST, GraphQL, CLI, queues)
- Long-lived applications that will evolve

**Skip it when:**
- Simple CRUD applications
- Prototypes or MVPs
- Small team with tight deadlines
- Domain logic is minimal

#### Your Project Structure (Retail Management)

```
src/main/java/com/retailmanagement/
├── module/
│   └── auth/
│       ├── controller/          ← Input Adapter (REST)
│       │   └── AuthController.java
│       ├── service/             ← Port (Input Interface) + Application
│       │   ├── AuthService.java
│       │   └── impl/
│       │       └── AuthServiceImpl.java
│       ├── dto/                 ← Data Transfer Objects
│       │   ├── request/
│       │   └── response/
│       └── repository/          ← Port (Output Interface)
├── infrastructure/
│   └── persistence/
│       ├── entity/              ← Output Adapter (JPA Entities)
│       └── repository/          ← Output Adapter (JPA Implementation)
├── common/                      ← Shared utilities
│   ├── exception/
│   └── dto/
└── config/                      ← Configuration (wiring adapters)
```

---

### Domain-Driven Design (DDD) Deep Dive

#### What is Domain-Driven Design?

**Domain-Driven Design (DDD)** is a software development approach introduced by Eric Evans in his 2003 book "Domain-Driven Design: Tackling Complexity in the Heart of Software." It focuses on creating software that reflects complex business domains by placing the **domain model** at the center of development.

DDD is NOT a framework or technology—it's a **mindset** and **set of patterns** for handling complexity in business software.

#### Why DDD?

The core problem DDD solves: **Software becomes increasingly difficult to change as complexity grows.**

```
Without DDD:
┌─────────────────────────────────────────────────────┐
│  Business Logic scattered across:                   │
│  - Controllers (validation, business rules)         │
│  - Services (half business, half orchestration)     │
│  - Entities (just data holders, anemic domain)      │
│  - Stored procedures (hidden business logic)        │
│  - Front-end (UI validation = business rules?)      │
└─────────────────────────────────────────────────────┘
Result: Changes require touching multiple layers

With DDD:
┌─────────────────────────────────────────────────────┐
│  Business Logic centralized in:                     │
│  - Domain Model (entities with behavior)            │
│  - Domain Services (cross-entity operations)        │
│  - Value Objects (immutable concepts)               │
└─────────────────────────────────────────────────────┘
Result: Changes are localized to the domain
```

#### Strategic vs Tactical DDD

DDD has two parts:

| Type | Focus | Patterns |
|------|-------|----------|
| **Strategic DDD** | Big picture—how to divide the system | Bounded Contexts, Ubiquitous Language, Context Maps |
| **Tactical DDD** | Implementation—how to model within a context | Entities, Value Objects, Aggregates, Repositories, Domain Events |

---

### Strategic DDD Patterns

#### 1. Ubiquitous Language

A **shared vocabulary** between developers and domain experts that appears in code, documentation, and conversations.

**Bad Example (Technical Jargon):**
```java
// Developer speaks "tech"
class UserDTO {
    String custId;      // What's "cust"?
    int accStatus;      // Account? Access? What statuses?
    String txnType;     // Transaction type... of what?
}
```

**Good Example (Ubiquitous Language):**
```java
// Code speaks the same language as business
class Customer {
    CustomerId id;
    AccountStatus status;  // ACTIVE, SUSPENDED, CLOSED
}

enum AccountStatus {
    ACTIVE,      // Customer can place orders
    SUSPENDED,   // Pending payment issues
    CLOSED       // Account terminated
}

// In conversation:
// ✅ "When a customer is suspended, they cannot place orders"
// ❌ "When accStatus equals 2, disable the order endpoint"
```

#### 2. Bounded Context

A **boundary** within which a particular domain model is defined and applicable. Different contexts may use the same term differently.

**Example: "Product" in Different Contexts**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           E-Commerce System                                  │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│   Catalog Context   │  Inventory Context  │      Shipping Context           │
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│   Product:          │   Product:          │   Product:                      │
│   - Name            │   - SKU             │   - SKU                         │
│   - Description     │   - Quantity        │   - Weight                      │
│   - Price           │   - Warehouse       │   - Dimensions                  │
│   - Images          │   - ReorderLevel    │   - IsFragile                   │
│   - Categories      │   - SupplierInfo    │   - ShippingClass               │
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│   Cares about:      │   Cares about:      │   Cares about:                  │
│   - Display         │   - Stock levels    │   - How to pack & ship          │
│   - Marketing       │   - Replenishment   │   - Delivery cost               │
└─────────────────────┴─────────────────────┴─────────────────────────────────┘
```

**In Code:**

```java
// Catalog Context
package com.retail.catalog.domain;

public class Product {
    ProductId id;
    String name;
    String description;
    Money price;
    List<Image> images;
    CategoryId categoryId;
}

// Inventory Context - DIFFERENT Product model
package com.retail.inventory.domain;

public class StockItem {  // Not even called "Product" here!
    SKU sku;
    int quantityOnHand;
    int reorderLevel;
    WarehouseId warehouseId;
}

// Shipping Context
package com.retail.shipping.domain;

public class Parcel {
    SKU sku;
    Weight weight;
    Dimensions dimensions;
    boolean fragile;
    ShippingClass shippingClass;
}
```

#### 3. Context Map

Shows **relationships between bounded contexts** and how they communicate.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Context Map                                       │
│                                                                              │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐        │
│   │   Catalog    │         │    Order     │         │   Payment    │        │
│   │   Context    │────────▶│   Context    │────────▶│   Context    │        │
│   └──────────────┘   ACL   └──────────────┘  OHS    └──────────────┘        │
│         │                        │                                           │
│         │ Published              │ Customer-                                 │
│         │ Language               │ Supplier                                  │
│         ▼                        ▼                                           │
│   ┌──────────────┐         ┌──────────────┐                                 │
│   │  Inventory   │         │   Shipping   │                                 │
│   │   Context    │         │   Context    │                                 │
│   └──────────────┘         └──────────────┘                                 │
│                                                                              │
│   Integration Patterns:                                                      │
│   • ACL = Anti-Corruption Layer (translate external models)                  │
│   • OHS = Open Host Service (published API for others)                       │
│   • Published Language = Shared schema (events, contracts)                   │
│   • Customer-Supplier = Upstream/downstream dependency                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Tactical DDD Patterns

#### 1. Entity

An object with a **unique identity** that persists over time. Two entities with the same attributes but different IDs are different.

```java
public class Customer {
    private final CustomerId id;  // Identity - never changes
    private String name;          // Can change
    private Email email;          // Can change
    private Address address;      // Can change
    
    // Business behavior
    public void changeEmail(Email newEmail) {
        if (this.email.equals(newEmail)) {
            throw new SameEmailException("Email is already " + newEmail);
        }
        // Could publish CustomerEmailChangedEvent
        this.email = newEmail;
    }
    
    // Entities are equal by ID, not attributes
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Customer other)) return false;
        return id.equals(other.id);
    }
    
    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
```

#### 2. Value Object

An **immutable object** with no identity, defined only by its attributes. Two value objects with the same attributes are equal.

```java
// Value Object - immutable, no ID
public record Money(BigDecimal amount, Currency currency) {
    
    public Money {
        // Validation in constructor
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        Objects.requireNonNull(currency, "Currency required");
    }
    
    public Money add(Money other) {
        requireSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }
    
    public Money subtract(Money other) {
        requireSameCurrency(other);
        BigDecimal result = this.amount.subtract(other.amount);
        return new Money(result, this.currency);
    }
    
    public Money multiply(int quantity) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(quantity)), this.currency);
    }
    
    private void requireSameCurrency(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new CurrencyMismatchException(
                "Cannot operate on %s and %s".formatted(this.currency, other.currency)
            );
        }
    }
}

// More Value Object examples
public record Email(String value) {
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    public Email {
        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new InvalidEmailException(value);
        }
    }
}

public record Address(
    String street,
    String city,
    String state,
    String zipCode,
    Country country
) {
    public String fullAddress() {
        return "%s, %s, %s %s, %s".formatted(street, city, state, zipCode, country.name());
    }
}

public record DateRange(LocalDate start, LocalDate end) {
    public DateRange {
        if (end.isBefore(start)) {
            throw new InvalidDateRangeException("End date must be after start date");
        }
    }
    
    public boolean contains(LocalDate date) {
        return !date.isBefore(start) && !date.isAfter(end);
    }
    
    public boolean overlaps(DateRange other) {
        return !this.end.isBefore(other.start) && !this.start.isAfter(other.end);
    }
}
```

**Entity vs Value Object:**

| Aspect | Entity | Value Object |
|--------|--------|--------------|
| Identity | Has unique ID | No ID—defined by attributes |
| Mutability | Can change over time | Immutable |
| Equality | Equal if same ID | Equal if same attributes |
| Lifecycle | Tracked, persisted | Replaceable, embedded |
| Examples | Customer, Order, Product | Money, Email, Address, DateRange |

#### 3. Aggregate

A **cluster of entities and value objects** treated as a single unit. Has one **Aggregate Root** that controls access and enforces invariants.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Order Aggregate                          │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Order (Root)                          │   │
│   │   - orderId: OrderId                                     │   │
│   │   - customerId: CustomerId (reference to another agg)    │   │
│   │   - status: OrderStatus                                  │   │
│   │   - totalAmount: Money                                   │   │
│   │                                                          │   │
│   │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│   │   │ OrderItem   │ │ OrderItem   │ │ OrderItem   │       │   │
│   │   │ - productId │ │ - productId │ │ - productId │       │   │
│   │   │ - quantity  │ │ - quantity  │ │ - quantity  │       │   │
│   │   │ - unitPrice │ │ - unitPrice │ │ - unitPrice │       │   │
│   │   └─────────────┘ └─────────────┘ └─────────────┘       │   │
│   │                                                          │   │
│   │   ┌─────────────────────┐                               │   │
│   │   │ ShippingAddress     │ (Value Object)                │   │
│   │   │ - street, city, ... │                               │   │
│   │   └─────────────────────┘                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Rules:                                                         │
│   • Only access OrderItems through Order (root)                 │
│   • Order maintains invariants (e.g., totalAmount = sum of items)│
│   • Transaction boundary = entire aggregate                     │
└─────────────────────────────────────────────────────────────────┘
```

**Code Example:**

```java
public class Order {  // Aggregate Root
    private final OrderId id;
    private final CustomerId customerId;
    private final List<OrderItem> items;  // Private - only accessible via root
    private OrderStatus status;
    private Money totalAmount;
    private ShippingAddress shippingAddress;
    
    // Factory method - controls creation
    public static Order create(CustomerId customerId, ShippingAddress address) {
        return new Order(
            OrderId.generate(),
            customerId,
            new ArrayList<>(),
            OrderStatus.DRAFT,
            Money.ZERO,
            address
        );
    }
    
    // All modifications go through the root
    public void addItem(ProductId productId, int quantity, Money unitPrice) {
        if (status != OrderStatus.DRAFT) {
            throw new OrderNotModifiableException("Cannot modify " + status + " order");
        }
        if (quantity <= 0) {
            throw new InvalidQuantityException("Quantity must be positive");
        }
        
        // Check if item already exists
        Optional<OrderItem> existing = items.stream()
            .filter(item -> item.getProductId().equals(productId))
            .findFirst();
        
        if (existing.isPresent()) {
            existing.get().increaseQuantity(quantity);
        } else {
            items.add(new OrderItem(productId, quantity, unitPrice));
        }
        
        recalculateTotal();  // Maintain invariant
    }
    
    public void removeItem(ProductId productId) {
        if (status != OrderStatus.DRAFT) {
            throw new OrderNotModifiableException("Cannot modify " + status + " order");
        }
        
        items.removeIf(item -> item.getProductId().equals(productId));
        recalculateTotal();
    }
    
    public void submit() {
        if (items.isEmpty()) {
            throw new EmptyOrderException("Cannot submit order with no items");
        }
        if (status != OrderStatus.DRAFT) {
            throw new InvalidOrderStateException("Can only submit DRAFT orders");
        }
        
        this.status = OrderStatus.PENDING;
        // Would raise OrderSubmittedEvent
    }
    
    public void confirm() {
        if (status != OrderStatus.PENDING) {
            throw new InvalidOrderStateException("Can only confirm PENDING orders");
        }
        this.status = OrderStatus.CONFIRMED;
    }
    
    public void cancel(String reason) {
        if (status == OrderStatus.SHIPPED || status == OrderStatus.DELIVERED) {
            throw new InvalidOrderStateException("Cannot cancel shipped/delivered orders");
        }
        this.status = OrderStatus.CANCELLED;
    }
    
    // Invariant: totalAmount always equals sum of items
    private void recalculateTotal() {
        this.totalAmount = items.stream()
            .map(OrderItem::subtotal)
            .reduce(Money.ZERO, Money::add);
    }
    
    // Return immutable view - don't expose internal list
    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }
}

// Entity within aggregate - NOT accessible directly
public class OrderItem {
    private final ProductId productId;
    private int quantity;
    private final Money unitPrice;
    
    // Package-private - only Order can modify
    void increaseQuantity(int amount) {
        this.quantity += amount;
    }
    
    public Money subtotal() {
        return unitPrice.multiply(quantity);
    }
}
```

**Aggregate Rules:**

1. **Reference by ID** - Aggregates reference other aggregates by ID, not direct object reference
2. **One transaction per aggregate** - Don't modify multiple aggregates in one transaction
3. **Root controls access** - External code only interacts with the root
4. **Consistency boundary** - Invariants are enforced within the aggregate

#### 4. Domain Service

Operations that **don't belong to a single entity** but are still domain logic.

```java
// Domain Service - operation spanning multiple aggregates
public class PricingService {
    
    private final DiscountPolicyRepository discountPolicyRepository;
    private final CustomerRepository customerRepository;
    
    public Money calculateOrderTotal(Order order, CustomerId customerId) {
        Customer customer = customerRepository.findById(customerId);
        List<DiscountPolicy> policies = discountPolicyRepository.findApplicable(
            customer.getTier(),
            order.getItems()
        );
        
        Money subtotal = order.getSubtotal();
        
        for (DiscountPolicy policy : policies) {
            subtotal = policy.apply(subtotal, order);
        }
        
        return subtotal;
    }
}

// Another example: Transfer between accounts
public class MoneyTransferService {
    
    public void transfer(Account source, Account destination, Money amount) {
        if (source.getBalance().lessThan(amount)) {
            throw new InsufficientFundsException();
        }
        
        source.debit(amount);
        destination.credit(amount);
        
        // This operation doesn't belong to Account entity
        // because it involves TWO accounts
    }
}
```

#### 5. Repository

Abstracts **persistence** and provides collection-like access to aggregates.

```java
// Repository interface (in domain layer)
public interface OrderRepository {
    Order findById(OrderId id);
    Optional<Order> findByIdOptional(OrderId id);
    List<Order> findByCustomerId(CustomerId customerId);
    List<Order> findByStatus(OrderStatus status);
    Order save(Order order);
    void delete(OrderId id);
    
    // Specification pattern for complex queries
    List<Order> findAll(OrderSpecification spec);
}

// Implementation (in infrastructure layer)
@Repository
public class JpaOrderRepository implements OrderRepository {
    
    private final OrderJpaRepository jpaRepo;
    private final OrderMapper mapper;
    
    @Override
    public Order findById(OrderId id) {
        return jpaRepo.findById(id.value())
            .map(mapper::toDomain)
            .orElseThrow(() -> new OrderNotFoundException(id));
    }
    
    @Override
    public Order save(Order order) {
        OrderEntity entity = mapper.toEntity(order);
        OrderEntity saved = jpaRepo.save(entity);
        return mapper.toDomain(saved);
    }
}
```

#### 6. Domain Events

Something **important that happened** in the domain that other parts of the system care about.

```java
// Domain Event - immutable record of something that happened
public record OrderPlacedEvent(
    String eventId,
    LocalDateTime occurredAt,
    OrderId orderId,
    CustomerId customerId,
    Money totalAmount,
    List<OrderItemSnapshot> items
) {
    public OrderPlacedEvent {
        eventId = eventId != null ? eventId : UUID.randomUUID().toString();
        occurredAt = occurredAt != null ? occurredAt : LocalDateTime.now();
    }
}

public record OrderItemSnapshot(
    ProductId productId,
    int quantity,
    Money unitPrice
) {}

// Aggregate raises events
public class Order {
    private final List<DomainEvent> domainEvents = new ArrayList<>();
    
    public void submit() {
        // ... validation ...
        this.status = OrderStatus.PENDING;
        
        // Raise event
        domainEvents.add(new OrderPlacedEvent(
            null, null,
            this.id,
            this.customerId,
            this.totalAmount,
            items.stream()
                .map(i -> new OrderItemSnapshot(i.getProductId(), i.getQuantity(), i.getUnitPrice()))
                .toList()
        ));
    }
    
    public List<DomainEvent> getDomainEvents() {
        return Collections.unmodifiableList(domainEvents);
    }
    
    public void clearDomainEvents() {
        domainEvents.clear();
    }
}

// Application service publishes events after persistence
@Service
@RequiredArgsConstructor
public class OrderApplicationService {
    
    private final OrderRepository orderRepository;
    private final DomainEventPublisher eventPublisher;
    
    @Transactional
    public OrderId submitOrder(SubmitOrderCommand command) {
        Order order = orderRepository.findById(command.orderId());
        
        order.submit();
        orderRepository.save(order);
        
        // Publish events after successful transaction
        order.getDomainEvents().forEach(eventPublisher::publish);
        order.clearDomainEvents();
        
        return order.getId();
    }
}

// Event handlers in other contexts
@Component
public class InventoryEventHandler {
    
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        // Reserve inventory for order items
        event.items().forEach(item -> 
            inventoryService.reserve(item.productId(), item.quantity())
        );
    }
}

@Component
public class NotificationEventHandler {
    
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        // Send confirmation email
        notificationService.sendOrderConfirmation(event.customerId(), event.orderId());
    }
}
```

---

### Anemic vs Rich Domain Model

**Anemic Domain Model (Anti-pattern):**

```java
// Anemic - just a data holder, no behavior
public class Order {
    private Long id;
    private String status;
    private List<OrderItem> items;
    private BigDecimal total;
    
    // Only getters and setters - NO business logic
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    // ...
}

// Business logic scattered in services
public class OrderService {
    public void submitOrder(Order order) {
        if (order.getItems().isEmpty()) {
            throw new Exception("No items");
        }
        order.setStatus("PENDING");  // Direct manipulation
        
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            total = total.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setTotal(total);  // Logic that should be in Order
        
        orderRepository.save(order);
    }
}
```

**Rich Domain Model (DDD):**

```java
// Rich - behavior lives with data
public class Order {
    private final OrderId id;
    private OrderStatus status;
    private final List<OrderItem> items;
    private Money totalAmount;
    
    // Business logic IN the entity
    public void submit() {
        validateCanSubmit();
        this.status = OrderStatus.PENDING;
        recalculateTotal();
    }
    
    private void validateCanSubmit() {
        if (items.isEmpty()) {
            throw new EmptyOrderException("Cannot submit empty order");
        }
        if (status != OrderStatus.DRAFT) {
            throw new InvalidStateException("Only draft orders can be submitted");
        }
    }
    
    private void recalculateTotal() {
        this.totalAmount = items.stream()
            .map(OrderItem::subtotal)
            .reduce(Money.ZERO, Money::add);
    }
    
    // No setters! State changes through meaningful methods
}

// Service becomes thin - just orchestration
public class OrderApplicationService {
    public OrderId submitOrder(SubmitOrderCommand command) {
        Order order = orderRepository.findById(command.orderId());
        order.submit();  // Business logic delegated to entity
        return orderRepository.save(order).getId();
    }
}
```

---

### DDD in Your Retail Management Project

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Retail Management Bounded Contexts                        │
├────────────────┬────────────────┬────────────────┬──────────────────────────┤
│  Auth Context  │ Product Context│ Order Context  │ Inventory Context        │
├────────────────┼────────────────┼────────────────┼──────────────────────────┤
│ Entities:      │ Entities:      │ Entities:      │ Entities:                │
│ - User         │ - Product      │ - Order        │ - StockItem              │
│ - Tenant       │ - Category     │ - OrderItem    │ - Warehouse              │
│ - Role         │ - Variant      │                │ - Movement               │
│                │                │                │                          │
│ Value Objects: │ Value Objects: │ Value Objects: │ Value Objects:           │
│ - Email        │ - SKU          │ - Money        │ - Quantity               │
│ - Password     │ - Price        │ - Address      │ - Location               │
│                │ - Barcode      │ - DateRange    │                          │
│                │                │                │                          │
│ Aggregates:    │ Aggregates:    │ Aggregates:    │ Aggregates:              │
│ - User (root)  │ - Product(root)│ - Order (root) │ - StockItem (root)       │
│   └── Roles    │   └── Variants │   └── Items    │   └── Movements          │
└────────────────┴────────────────┴────────────────┴──────────────────────────┘
```

---

### When to Use DDD

**Use DDD when:**
- Complex business domain with many rules
- Domain experts are available
- Long-term project that will evolve
- Team is willing to invest in learning

**Skip DDD when:**
- Simple CRUD applications
- Technical/infrastructure focus (not business logic)
- Tight deadlines with no domain expert access
- Team unfamiliar with DDD patterns

---

### DDD + Hexagonal Architecture

DDD and Hexagonal Architecture complement each other:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Combined Architecture                                │
│                                                                              │
│   Hexagonal provides:              DDD provides:                             │
│   • Isolation structure            • How to model the domain                 │
│   • Ports & Adapters               • Entities, Value Objects, Aggregates    │
│   • Infrastructure separation      • Ubiquitous Language                     │
│                                    • Bounded Contexts                        │
│                                                                              │
│   ┌───────────────────────────────────────────────────────────────────┐     │
│   │                        Input Adapters                              │     │
│   │                   (REST, GraphQL, CLI, Kafka)                      │     │
│   └───────────────────────────────┬───────────────────────────────────┘     │
│                                   │                                          │
│   ┌───────────────────────────────▼───────────────────────────────────┐     │
│   │                     Application Services                           │     │
│   │                   (Use Cases, Commands, Queries)                   │     │
│   └───────────────────────────────┬───────────────────────────────────┘     │
│                                   │                                          │
│   ┌───────────────────────────────▼───────────────────────────────────┐     │
│   │                      DOMAIN LAYER (DDD)                            │     │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐    │     │
│   │  │  Entities   │  │   Value     │  │     Aggregates          │    │     │
│   │  │             │  │   Objects   │  │  ┌─────────┐            │    │     │
│   │  │  • Order    │  │  • Money    │  │  │ Order   │            │    │     │
│   │  │  • Customer │  │  • Email    │  │  │  └Items │            │    │     │
│   │  │  • Product  │  │  • Address  │  │  └─────────┘            │    │     │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘    │     │
│   │  ┌─────────────────────────────────────────────────────────────┐  │     │
│   │  │  Domain Services    │    Repository Interfaces (Ports)      │  │     │
│   │  └─────────────────────────────────────────────────────────────┘  │     │
│   └───────────────────────────────┬───────────────────────────────────┘     │
│                                   │                                          │
│   ┌───────────────────────────────▼───────────────────────────────────┐     │
│   │                        Output Adapters                             │     │
│   │                (JPA Repositories, External APIs, Cache)           │     │
│   └───────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Architecture Types Comparison: Landing Zone vs High-Level vs Deployment

Understanding the different types of architecture documentation is crucial for senior engineers. Each serves a different purpose and audience.

#### Overview Comparison

| Aspect | Landing Zone | High-Level Architecture | Deployment Architecture |
|--------|--------------|------------------------|------------------------|
| **What it is** | Cloud foundation/platform | System design & components | How/where code runs |
| **Scope** | Organization-wide | Single application/system | Single application |
| **Owner** | Platform/Cloud team | Solution Architect | DevOps/SRE team |
| **Audience** | Cloud engineers, Security | Developers, Stakeholders | Ops, DevOps, SRE |
| **Changes** | Rare (foundational) | Per major feature | Per release/deployment |
| **Focus** | Accounts, networking, security | Services, data flow, integrations | Containers, servers, scaling |

#### Visual Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LANDING ZONE                                       │
│                    (Cloud Foundation / Platform)                             │
│                                                                              │
│   "WHERE can applications be deployed?"                                      │
│                                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │ Management  │  │  Security   │  │    Dev      │  │    Prod     │        │
│   │  Account    │  │   Account   │  │   Account   │  │   Account   │        │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│   • Multi-account structure        • IAM policies & roles                    │
│   • VPCs, subnets, firewalls      • Compliance guardrails                   │
│   • Centralized logging           • Cost management                          │
│   • SSO/Identity federation       • Network connectivity                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HIGH-LEVEL ARCHITECTURE                                │
│                    (System Design / Solution)                                │
│                                                                              │
│   "WHAT does the system do and how do components interact?"                  │
│                                                                              │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐           │
│   │  Mobile  │────▶│   API    │────▶│ Order    │────▶│ Payment  │           │
│   │   App    │     │ Gateway  │     │ Service  │     │ Service  │           │
│   └──────────┘     └──────────┘     └──────────┘     └──────────┘           │
│                          │               │                │                  │
│   ┌──────────┐           │               │                │                  │
│   │   Web    │───────────┘               ▼                ▼                  │
│   │   App    │                    ┌──────────┐     ┌──────────┐             │
│   └──────────┘                    │   DB     │     │  Stripe  │             │
│                                   │ (Postgres)│     │   API    │             │
│                                   └──────────┘     └──────────┘             │
│                                                                              │
│   • Services & their responsibilities    • Data flow between components      │
│   • Integration points                   • External dependencies             │
│   • Domain boundaries                    • Technology choices                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DEPLOYMENT ARCHITECTURE                                │
│                    (Infrastructure / Runtime)                                │
│                                                                              │
│   "HOW and WHERE does the code actually run?"                                │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        Kubernetes Cluster                            │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │  Namespace: retail-prod                                      │    │   │
│   │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │    │   │
│   │  │  │ Order   │ │ Order   │ │ Order   │ │ Payment │            │    │   │
│   │  │  │ Pod 1   │ │ Pod 2   │ │ Pod 3   │ │ Pod 1   │  ...       │    │   │
│   │  │  │ 2CPU/4GB│ │ 2CPU/4GB│ │ 2CPU/4GB│ │ 1CPU/2GB│            │    │   │
│   │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                          │                                                   │
│   ┌──────────────────────┼──────────────────────────────────────────────┐   │
│   │                      ▼                                               │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│   │  │ RDS Postgres│  │ ElastiCache │  │     S3      │                  │   │
│   │  │  Primary    │  │   Redis     │  │   Bucket    │                  │   │
│   │  │  + Replica  │  │   Cluster   │  │             │                  │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   • Container specs (CPU, memory)        • Replica counts                    │
│   • Node pools & instance types          • Auto-scaling rules               │
│   • Load balancers & ingress             • Database sizing                   │
│   • Storage volumes                      • Network policies                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Breakdown

##### 1. Landing Zone Architecture

**Purpose:** Establish a secure, compliant, multi-account cloud foundation before deploying any applications.

**Key Questions Answered:**
- How are AWS/Azure/GCP accounts organized?
- How do users authenticate (SSO, IAM)?
- How do networks connect across accounts?
- What security guardrails are enforced?
- Where do logs go? Who can access what?

**Components:**
```
Landing Zone Components:
├── Account Structure
│   ├── Management Account (billing, organization)
│   ├── Security Account (logs, audit, SIEM)
│   ├── Shared Services Account (CI/CD, DNS, networking)
│   ├── Development Accounts (per team/project)
│   └── Production Accounts (isolated, restricted)
│
├── Identity & Access
│   ├── AWS IAM Identity Center (SSO)
│   ├── Role-based access (Admin, Developer, ReadOnly)
│   └── Service accounts for automation
│
├── Networking
│   ├── Transit Gateway (hub-and-spoke)
│   ├── VPCs per account with standard CIDR
│   ├── VPN/Direct Connect to on-premises
│   └── Firewall rules and security groups
│
├── Security & Compliance
│   ├── AWS Config rules
│   ├── GuardDuty, Security Hub
│   ├── Encryption policies (KMS)
│   └── Compliance frameworks (SOC2, HIPAA)
│
└── Operations
    ├── Centralized CloudWatch/Datadog
    ├── Cost management & budgets
    └── Backup policies
```

**Example (AWS):**
```yaml
# AWS Control Tower Landing Zone
Organization:
  ManagementAccount:
    - AWS Organizations
    - AWS Control Tower
    - AWS SSO
    
  SecurityOU:
    LogArchive:
      - S3 buckets for all logs
      - CloudTrail aggregation
    Audit:
      - Security Hub
      - GuardDuty
      - AWS Config
      
  InfrastructureOU:
    SharedServices:
      - Transit Gateway
      - Route53 DNS
      - CI/CD pipelines
      - Container registry (ECR)
      
  WorkloadsOU:
    Development:
      - Dev VPC (10.1.0.0/16)
      - Lower instance limits
      - Relaxed security for experimentation
    Production:
      - Prod VPC (10.2.0.0/16)
      - Strict change management
      - High availability required
```

##### 2. High-Level Architecture (HLA)

**Purpose:** Define the system's components, their responsibilities, and how they interact—independent of deployment details.

**Key Questions Answered:**
- What services/components exist?
- How do they communicate?
- What data does each own?
- What external systems do we integrate with?
- What are the domain boundaries?

**Components:**
```
High-Level Architecture Components:
├── Presentation Layer
│   ├── Web Application (React/Next.js)
│   ├── Mobile App (React Native)
│   └── Admin Dashboard
│
├── API Layer
│   ├── API Gateway (rate limiting, auth)
│   └── GraphQL Federation (optional)
│
├── Service Layer (Microservices)
│   ├── Auth Service (users, tokens, permissions)
│   ├── Product Service (catalog, pricing)
│   ├── Order Service (cart, checkout, orders)
│   ├── Inventory Service (stock, warehouses)
│   ├── Payment Service (transactions, refunds)
│   └── Notification Service (email, SMS, push)
│
├── Data Layer
│   ├── PostgreSQL (transactional data)
│   ├── Redis (cache, sessions)
│   ├── Elasticsearch (search)
│   └── S3 (files, images)
│
├── Integration Layer
│   ├── Message Broker (Kafka/RabbitMQ)
│   └── Event Bus
│
└── External Systems
    ├── Payment Gateway (Stripe)
    ├── Shipping Provider (FedEx API)
    ├── Email Service (SendGrid)
    └── Analytics (Segment, Amplitude)
```

**Example Diagram:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Retail Management System - HLA                            │
│                                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                                  │
│   │   Web    │  │  Mobile  │  │   POS    │                                  │
│   │   App    │  │   App    │  │ Terminal │                                  │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘                                  │
│        │             │             │                                         │
│        └─────────────┴─────────────┘                                         │
│                      │                                                       │
│               ┌──────▼──────┐                                                │
│               │ API Gateway │ ◄─── Rate limiting, Auth, Routing              │
│               └──────┬──────┘                                                │
│                      │                                                       │
│   ┌──────────────────┼──────────────────────────────────────┐               │
│   │                  │         Service Mesh                  │               │
│   │   ┌──────────┐   │   ┌──────────┐   ┌──────────┐        │               │
│   │   │   Auth   │◄──┼──▶│  Order   │──▶│ Payment  │        │               │
│   │   │ Service  │   │   │ Service  │   │ Service  │        │               │
│   │   └────┬─────┘   │   └────┬─────┘   └────┬─────┘        │               │
│   │        │         │        │              │               │               │
│   │   ┌────▼─────┐   │   ┌────▼─────┐   ┌────▼─────┐        │               │
│   │   │ Product  │   │   │Inventory │   │  Notify  │        │               │
│   │   │ Service  │   │   │ Service  │   │ Service  │        │               │
│   │   └──────────┘   │   └──────────┘   └──────────┘        │               │
│   └──────────────────┼──────────────────────────────────────┘               │
│                      │                                                       │
│   ┌──────────────────▼──────────────────────────────────────┐               │
│   │                    Event Bus (Kafka)                     │               │
│   │   Topics: order.created, payment.completed, stock.low    │               │
│   └──────────────────────────────────────────────────────────┘               │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────┐               │
│   │                      Data Stores                          │               │
│   │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐          │               │
│   │  │Postgres│  │ Redis  │  │Elastic │  │   S3   │          │               │
│   │  │ (OLTP) │  │(Cache) │  │(Search)│  │(Files) │          │               │
│   │  └────────┘  └────────┘  └────────┘  └────────┘          │               │
│   └──────────────────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
```

##### 3. Deployment Architecture

**Purpose:** Define exactly how and where the system runs—containers, servers, scaling, networking at runtime.

**Key Questions Answered:**
- What containers/pods run where?
- How many replicas of each service?
- What CPU/memory does each need?
- How does traffic route to services?
- How does auto-scaling work?
- What's the database sizing?

**Components:**
```
Deployment Architecture Components:
├── Compute
│   ├── Kubernetes cluster configuration
│   ├── Node pools (size, count, instance types)
│   ├── Pod specifications (replicas, resources)
│   └── Horizontal Pod Autoscaler rules
│
├── Networking
│   ├── Ingress controllers (nginx, ALB)
│   ├── Service mesh (Istio, Linkerd)
│   ├── Network policies
│   └── DNS and certificates
│
├── Storage
│   ├── Persistent volumes
│   ├── Database instances (size, IOPS)
│   └── Object storage configuration
│
├── Observability
│   ├── Prometheus/Grafana
│   ├── ELK/Loki for logs
│   ├── Jaeger for tracing
│   └── Alerting rules
│
└── CI/CD
    ├── Deployment pipelines
    ├── Helm charts/Kustomize
    └── GitOps (ArgoCD)
```

**Example (Kubernetes):**
```yaml
# deployment-architecture.yaml
---
# Order Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: retail-prod
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      containers:
        - name: order-service
          image: retail/order-service:v2.3.1
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "2Gi"
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "prod"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
---
# Database (RDS via Terraform)
# resource "aws_db_instance" "orders_db" {
#   identifier           = "orders-prod"
#   instance_class       = "db.r6g.xlarge"
#   allocated_storage    = 100
#   storage_type         = "gp3"
#   iops                 = 3000
#   engine               = "postgres"
#   engine_version       = "15.4"
#   multi_az             = true
#   backup_retention     = 7
#   deletion_protection  = true
# }
```

#### When Each Architecture Is Used

| Phase | Architecture Type | Activities |
|-------|------------------|------------|
| **Cloud Setup** | Landing Zone | Platform team sets up accounts, networking, security |
| **System Design** | High-Level | Architect designs services, data flow, integrations |
| **Sprint Planning** | High-Level | Team references HLA to understand boundaries |
| **Implementation** | (Code-level) | Developers write code following DDD/Hexagonal |
| **Deployment** | Deployment | DevOps defines K8s manifests, sizing, scaling |
| **Go-Live** | All three | Verify Landing Zone compliance, HLA alignment, Deployment correctness |
| **Incident Response** | Deployment | SRE checks pod health, scaling, resource usage |

#### Relationship Between Architectures

```
                    ┌─────────────────────────────┐
                    │        Landing Zone         │
                    │   (Cloud Platform Team)     │
                    │                             │
                    │  "Here's your VPC, IAM      │
                    │   roles, and logging.       │
                    │   Deploy your apps here."   │
                    └─────────────┬───────────────┘
                                  │
                                  │ Provides infrastructure
                                  │
                    ┌─────────────▼───────────────┐
                    │   High-Level Architecture   │
                    │    (Solution Architect)     │
                    │                             │
                    │  "These are the services,   │
                    │   how they talk, and what   │
                    │   data they own."           │
                    └─────────────┬───────────────┘
                                  │
                                  │ Guides implementation
                                  │
     ┌────────────────────────────┼────────────────────────────┐
     │                            │                            │
     ▼                            ▼                            ▼
┌─────────────┐          ┌─────────────────┐          ┌─────────────────┐
│   DDD /     │          │   Code-Level    │          │   Deployment    │
│  Hexagonal  │          │  Architecture   │          │  Architecture   │
│             │          │                 │          │                 │
│ "How to     │          │ "Classes,       │          │ "Pods, replicas,│
│  model the  │          │  packages,      │          │  scaling, infra │
│  domain"    │          │  APIs"          │          │  specs"         │
└─────────────┘          └─────────────────┘          └─────────────────┘
     │                            │                            │
     └────────────────────────────┴────────────────────────────┘
                                  │
                                  ▼
                         Running Application
```

#### Summary Table

| Architecture | Answers | Owned By | Artifacts |
|--------------|---------|----------|-----------|
| **Landing Zone** | Where can I deploy? | Platform Team | Account structure, VPCs, IAM, guardrails |
| **High-Level** | What components exist? | Solution Architect | System diagrams, service boundaries, data flow |
| **Deployment** | How does it run? | DevOps/SRE | K8s manifests, Terraform, Helm charts |
| **DDD/Hexagonal** | How is code structured? | Dev Team | Domain models, ports, adapters |

---

### Spring Security Deep Dive

#### What is Spring Security?

**Spring Security** is a powerful, highly customizable authentication and access-control framework for Java applications. It is the de-facto standard for securing Spring-based applications.

Spring Security provides:
- **Authentication**: Verifying who you are (username/password, OAuth2, SAML, etc.)
- **Authorization**: Verifying what you can access (roles, permissions)
- **Protection**: Against common attacks (CSRF, session fixation, clickjacking)

#### Core Concepts

| Concept | Description | Example |
|---------|-------------|---------|
| **Principal** | The currently authenticated user | User object with id, email, roles |
| **Authentication** | Proof of identity + granted authorities | Username/password validated |
| **Authorization** | Permission to perform an action | User has ROLE_ADMIN |
| **SecurityContext** | Holds Authentication for current thread | ThreadLocal storage |
| **Filter Chain** | Series of filters processing requests | JwtFilter → UsernamePasswordFilter |

#### The Filter Chain Architecture

Spring Security is built on a **chain of servlet filters**. Each filter handles a specific security concern.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HTTP Request Flow                                     │
│                                                                              │
│   Client Request                                                             │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    DelegatingFilterProxy                             │   │
│   │              (Bridge between Servlet and Spring)                     │   │
│   └───────────────────────────┬─────────────────────────────────────────┘   │
│                               │                                              │
│                               ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    FilterChainProxy                                  │   │
│   │              (Spring Security's entry point)                         │   │
│   └───────────────────────────┬─────────────────────────────────────────┘   │
│                               │                                              │
│                               ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Security Filter Chain                             │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │ 1. SecurityContextPersistenceFilter                         │    │   │
│   │  │    → Loads/saves SecurityContext between requests           │    │   │
│   │  ├─────────────────────────────────────────────────────────────┤    │   │
│   │  │ 2. CorsFilter                                               │    │   │
│   │  │    → Handles Cross-Origin Resource Sharing                  │    │   │
│   │  ├─────────────────────────────────────────────────────────────┤    │   │
│   │  │ 3. CsrfFilter                                               │    │   │
│   │  │    → Protects against Cross-Site Request Forgery            │    │   │
│   │  ├─────────────────────────────────────────────────────────────┤    │   │
│   │  │ 4. LogoutFilter                                             │    │   │
│   │  │    → Processes logout requests                              │    │   │
│   │  ├─────────────────────────────────────────────────────────────┤    │   │
│   │  │ 5. UsernamePasswordAuthenticationFilter                     │    │   │
│   │  │    → Processes form login (username/password)               │    │   │
│   │  ├─────────────────────────────────────────────────────────────┤    │   │
│   │  │ 6. JwtAuthenticationFilter (Custom)                         │    │   │
│   │  │    → Validates JWT tokens from Authorization header         │    │   │
│   │  ├─────────────────────────────────────────────────────────────┤    │   │
│   │  │ 7. ExceptionTranslationFilter                               │    │   │
│   │  │    → Converts security exceptions to HTTP responses         │    │   │
│   │  ├─────────────────────────────────────────────────────────────┤    │   │
│   │  │ 8. FilterSecurityInterceptor                                │    │   │
│   │  │    → Final authorization check before controller            │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   └───────────────────────────┬─────────────────────────────────────────┘   │
│                               │                                              │
│                               ▼                                              │
│                        Your Controller                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Authentication vs Authorization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   AUTHENTICATION (AuthN)              AUTHORIZATION (AuthZ)                  │
│   "Who are you?"                      "What can you do?"                     │
│                                                                              │
│   ┌─────────────────────────┐         ┌─────────────────────────┐           │
│   │ 1. User submits         │         │ 1. User is authenticated │           │
│   │    credentials          │         │                          │           │
│   │                         │         │ 2. Check user's roles/   │           │
│   │ 2. AuthenticationManager│         │    permissions           │           │
│   │    validates them       │         │                          │           │
│   │                         │         │ 3. Match against required│           │
│   │ 3. Returns Authentication│        │    authorities           │           │
│   │    object with Principal│         │                          │           │
│   │    and GrantedAuthorities│        │ 4. Grant or deny access  │           │
│   └─────────────────────────┘         └─────────────────────────┘           │
│                                                                              │
│   Examples:                           Examples:                              │
│   • Username + Password               • hasRole('ADMIN')                     │
│   • JWT Token                         • hasAuthority('read:users')           │
│   • OAuth2 / OpenID Connect           • @PreAuthorize expressions            │
│   • LDAP / Active Directory           • URL-based access rules               │
│   • Certificate-based (X.509)         • Method-level security                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     JWT Authentication Flow                                  │
│                                                                              │
│   ┌──────────┐                    ┌──────────┐                              │
│   │  Client  │                    │  Server  │                              │
│   └────┬─────┘                    └────┬─────┘                              │
│        │                               │                                     │
│        │  1. POST /api/auth/login      │                                     │
│        │  { email, password }          │                                     │
│        │──────────────────────────────▶│                                     │
│        │                               │                                     │
│        │                               │  2. Validate credentials            │
│        │                               │     (AuthenticationManager)         │
│        │                               │                                     │
│        │                               │  3. Generate JWT tokens             │
│        │                               │     (access + refresh)              │
│        │                               │                                     │
│        │  4. Return tokens             │                                     │
│        │◀──────────────────────────────│                                     │
│        │                               │                                     │
│        │  5. GET /api/orders           │                                     │
│        │  Authorization: Bearer {jwt}  │                                     │
│        │──────────────────────────────▶│                                     │
│        │                               │                                     │
│        │                               │  6. JwtFilter extracts token        │
│        │                               │     Validates signature & expiry    │
│        │                               │     Sets SecurityContext            │
│        │                               │                                     │
│        │                               │  7. FilterSecurityInterceptor       │
│        │                               │     Checks authorization            │
│        │                               │                                     │
│        │  8. Return data               │                                     │
│        │◀──────────────────────────────│                                     │
│        │                               │                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Key Components

**1. UserDetailsService - Load User Data**

```java
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        
        return UserPrincipal.builder()
            .id(user.getId())
            .email(user.getEmail())
            .password(user.getPassword())
            .authorities(mapRolesToAuthorities(user.getRoles()))
            .enabled(user.isEnabled())
            .accountNonLocked(!user.isLocked())
            .build();
    }
    
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Set<Role> roles) {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toSet());
    }
}
```

**2. JWT Authentication Filter - Validate Tokens**

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        try {
            String jwt = extractTokenFromRequest(request);
            
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String userId = tokenProvider.getUserIdFromToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
                
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication: {}", ex.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

**3. Security Configuration - Wire Everything Together**

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Enables @PreAuthorize, @PostAuthorize
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint authEntryPoint;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            // Disable CSRF for stateless APIs
            .csrf(AbstractHttpConfigurer::disable)
            
            // Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Stateless session (no session cookies)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Exception handling
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authEntryPoint)  // 401 handler
                .accessDeniedHandler(accessDeniedHandler()))  // 403 handler
            
            // URL-based authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Role-based access
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/manager/**").hasAnyRole("ADMIN", "MANAGER")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // Add JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            
            .build();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) 
            throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);  // Cost factor of 12
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

#### Method-Level Security

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    
    // Only users with ADMIN role
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOrder(Long orderId) {
        // ...
    }
    
    // Check if user owns the resource
    @PreAuthorize("#userId == authentication.principal.id")
    public List<Order> getUserOrders(Long userId) {
        // ...
    }
    
    // Multiple conditions
    @PreAuthorize("hasRole('ADMIN') or #order.userId == authentication.principal.id")
    public void updateOrder(Order order) {
        // ...
    }
    
    // Post-authorization (filter results)
    @PostAuthorize("returnObject.userId == authentication.principal.id")
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }
    
    // Filter collections
    @PostFilter("filterObject.status != 'DRAFT' or filterObject.userId == authentication.principal.id")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
```

#### Security Context Access

```java
// Get current authenticated user in Controller
@GetMapping("/me")
public UserResponse getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
    return UserResponse.from(principal);
}

// Get current user anywhere in the application
public class SecurityUtils {
    
    public static Optional<UserPrincipal> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal) {
            return Optional.of((UserPrincipal) principal);
        }
        
        return Optional.empty();
    }
    
    public static Long getCurrentUserId() {
        return getCurrentUser()
            .map(UserPrincipal::getId)
            .orElseThrow(() -> new UnauthorizedException("No authenticated user"));
    }
}
```

#### Common Security Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Role-Based (RBAC)** | Simple permission model | `hasRole('ADMIN')` |
| **Permission-Based** | Fine-grained control | `hasAuthority('order:write')` |
| **Resource-Based** | Owner can access | `@PreAuthorize("#id == principal.id")` |
| **Tenant Isolation** | Multi-tenant apps | Custom filter + tenant context |

#### Security Best Practices

1. **Always hash passwords** - Use BCrypt with cost ≥ 12
2. **Use HTTPS everywhere** - TLS for all traffic
3. **Validate JWT properly** - Check signature, expiry, issuer
4. **Implement token refresh** - Short-lived access tokens + refresh tokens
5. **Rate limit auth endpoints** - Prevent brute force attacks
6. **Log security events** - Failed logins, token invalidation
7. **Use method-level security** - Defense in depth
8. **Sanitize inputs** - Prevent injection attacks

---

## 2. OAuth2

### Answer
I integrate OAuth2 using Spring Security, handling JWT tokens and securing APIs with proper validation.

### Key Points
- Authorization Code flow
- Client Credentials flow
- JWT validation (signature, expiry)

### Senior Insight
- Token refresh strategies
- Scope-based authorization
- Token introspection vs validation

### Code Example: JWT Token Provider

```java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    
    private final JwtProperties jwtProperties;
    
    public String generateAccessToken(UserPrincipal userPrincipal) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getAccessTokenExpiration());
        
        return Jwts.builder()
            .setSubject(userPrincipal.getId().toString())
            .claim("email", userPrincipal.getEmail())
            .claim("roles", userPrincipal.getRoles())
            .claim("tenantId", userPrincipal.getTenantId())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }
    
    public String generateRefreshToken(UserPrincipal userPrincipal) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getRefreshTokenExpiration());
        
        return Jwts.builder()
            .setSubject(userPrincipal.getId().toString())
            .claim("type", "refresh")
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
            return false;
        }
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### Code Example: Security Configuration

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/orders/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

### Code Example: Token Refresh Strategy

```java
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    
    public TokenResponse refreshAccessToken(String refreshToken) {
        // Validate refresh token
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException("Invalid refresh token");
        }
        
        // Check if refresh token exists in database (not revoked)
        RefreshToken storedToken = refreshTokenRepository
            .findByToken(refreshToken)
            .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));
        
        // Check if token is expired
        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new InvalidTokenException("Refresh token expired");
        }
        
        // Generate new access token
        UserPrincipal userPrincipal = loadUserFromToken(refreshToken);
        String newAccessToken = tokenProvider.generateAccessToken(userPrincipal);
        
        // Optionally rotate refresh token
        String newRefreshToken = tokenProvider.generateRefreshToken(userPrincipal);
        storedToken.setToken(newRefreshToken);
        refreshTokenRepository.save(storedToken);
        
        return TokenResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .expiresIn(tokenProvider.getAccessTokenExpiration())
            .build();
    }
}
```

---

## 3. REST API Design

### Answer
I design REST APIs using proper HTTP methods, status codes, and resource-oriented URLs.

### Key Points
- GET, POST, PUT, DELETE
- Status codes: 200, 201, 400, 404, 500

### Senior Insight
- API-first design (OpenAPI)
- Pagination, filtering
- Idempotency

### HTTP Methods & Status Codes Reference

| Method | Purpose | Success Code | Body |
|--------|---------|--------------|------|
| GET    | Retrieve resource | 200 OK | Resource |
| POST   | Create resource | 201 Created | Created resource |
| PUT    | Full update | 200 OK | Updated resource |
| PATCH  | Partial update | 200 OK | Updated resource |
| DELETE | Remove resource | 204 No Content | None |

### Code Example: RESTful Controller with Pagination

```java
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        ProductFilter filter = ProductFilter.builder()
            .category(category)
            .minPrice(minPrice)
            .maxPrice(maxPrice)
            .build();
        
        Page<ProductResponse> products = productService.getProducts(
            filter, PageRequest.of(page, size, Sort.by(Sort.Direction.valueOf(sortDir), sortBy))
        );
        
        return ResponseEntity.ok(PageResponse.of(products));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }
    
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        ProductResponse created = productService.createProduct(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.getId())
            .toUri();
        return ResponseEntity.created(location).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Code Example: Standardized API Response

```java
@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }
}

@Data
@Builder
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;
    
    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
            .content(page.getContent())
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .last(page.isLast())
            .build();
    }
}
```

### Code Example: Idempotency Key Implementation

```java
@Service
@RequiredArgsConstructor
public class IdempotencyService {
    
    private final RedisTemplate<String, String> redisTemplate;
    private static final Duration IDEMPOTENCY_TTL = Duration.ofHours(24);
    
    public <T> T executeIdempotent(String idempotencyKey, Supplier<T> operation) {
        String cacheKey = "idempotency:" + idempotencyKey;
        
        // Check if already processed
        String cachedResult = redisTemplate.opsForValue().get(cacheKey);
        if (cachedResult != null) {
            return objectMapper.readValue(cachedResult, new TypeReference<T>() {});
        }
        
        // Execute operation
        T result = operation.get();
        
        // Cache result
        redisTemplate.opsForValue().set(cacheKey, 
            objectMapper.writeValueAsString(result), IDEMPOTENCY_TTL);
        
        return result;
    }
}

// Usage in Controller
@PostMapping("/payments")
public ResponseEntity<PaymentResponse> createPayment(
        @RequestHeader("Idempotency-Key") String idempotencyKey,
        @Valid @RequestBody CreatePaymentRequest request) {
    
    PaymentResponse response = idempotencyService.executeIdempotent(
        idempotencyKey,
        () -> paymentService.processPayment(request)
    );
    
    return ResponseEntity.ok(response);
}
```

---

## 4. API Versioning

### Answer
I use versioning via URL or headers to maintain backward compatibility.

### Key Points
- URL: /v1/orders
- Header-based versioning

### Senior Insight
- Deprecation strategy
- Migration planning

### Versioning Strategies Comparison

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| URL Path | /api/v1/orders | Simple, visible | URL changes |
| Query Param | /api/orders?version=1 | Optional | Easy to miss |
| Header | X-API-Version: 1 | Clean URLs | Hidden |
| Content-Type | Accept: application/vnd.api.v1+json | Follows HTTP standards | Complex |

### Code Example: URL-based Versioning

```java
// V1 Controller
@RestController
@RequestMapping("/api/v1/orders")
public class OrderControllerV1 {
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseV1> getOrder(@PathVariable Long id) {
        // Returns V1 response format
        return ResponseEntity.ok(orderService.getOrderV1(id));
    }
}

// V2 Controller with breaking changes
@RestController
@RequestMapping("/api/v2/orders")
public class OrderControllerV2 {
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseV2> getOrder(@PathVariable Long id) {
        // Returns V2 response format with additional fields
        return ResponseEntity.ok(orderService.getOrderV2(id));
    }
}
```

### Code Example: Header-based Versioning

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @GetMapping(value = "/{id}", headers = "X-API-Version=1")
    public ResponseEntity<OrderResponseV1> getOrderV1(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderV1(id));
    }
    
    @GetMapping(value = "/{id}", headers = "X-API-Version=2")
    public ResponseEntity<OrderResponseV2> getOrderV2(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderV2(id));
    }
}
```

### Code Example: Deprecation Strategy

```java
@RestController
@RequestMapping("/api/v1/orders")
@Deprecated(since = "2024-01-01", forRemoval = true) // Java annotation
public class OrderControllerV1 {
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseV1> getOrder(@PathVariable Long id) {
        // Add deprecation headers
        HttpHeaders headers = new HttpHeaders();
        headers.add("Deprecation", "true");
        headers.add("Sunset", "2024-06-01T00:00:00Z");
        headers.add("Link", "</api/v2/orders>; rel=\"successor-version\"");
        
        return ResponseEntity.ok()
            .headers(headers)
            .body(orderService.getOrderV1(id));
    }
}
```

---

## 5. Rate Limiting

### Answer
I implement rate limiting using Redis or API Gateway to protect services.

### Key Points
- Token bucket
- Leaky bucket

### Senior Insight
- Distributed rate limiting
- Per-user vs global limits

### Algorithm Comparison

| Algorithm | Description | Use Case |
|-----------|-------------|----------|
| Token Bucket | Tokens added at fixed rate, consumed per request | Allows bursts |
| Leaky Bucket | Requests processed at fixed rate | Smooth traffic |
| Fixed Window | Count requests in time window | Simple implementation |
| Sliding Window | Rolling time window | More accurate |

### Code Example: Redis-based Rate Limiter

```java
@Component
@RequiredArgsConstructor
public class RateLimiter {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    /**
     * Token Bucket Algorithm
     * @param key Unique identifier (e.g., userId, IP)
     * @param limit Max requests allowed
     * @param windowSeconds Time window in seconds
     * @return true if request is allowed
     */
    public boolean isAllowed(String key, int limit, int windowSeconds) {
        String redisKey = "rate_limit:" + key;
        long now = System.currentTimeMillis();
        long windowStart = now - (windowSeconds * 1000L);
        
        // Use Redis transaction
        return redisTemplate.execute(new SessionCallback<Boolean>() {
            @Override
            public Boolean execute(RedisOperations operations) {
                operations.multi();
                
                // Remove old entries outside window
                operations.opsForZSet().removeRangeByScore(redisKey, 0, windowStart);
                
                // Count current requests in window
                operations.opsForZSet().count(redisKey, windowStart, now);
                
                // Add current request
                operations.opsForZSet().add(redisKey, UUID.randomUUID().toString(), now);
                
                // Set TTL
                operations.expire(redisKey, Duration.ofSeconds(windowSeconds));
                
                List<Object> results = operations.exec();
                Long count = (Long) results.get(1);
                
                return count < limit;
            }
        });
    }
}
```

### Code Example: Rate Limiting Filter

```java
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {
    
    private final RateLimiter rateLimiter;
    
    // Global limit: 1000 requests per minute
    private static final int GLOBAL_LIMIT = 1000;
    // Per-user limit: 100 requests per minute
    private static final int USER_LIMIT = 100;
    private static final int WINDOW_SECONDS = 60;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        String userId = extractUserId(request);
        String clientIp = getClientIp(request);
        
        // Check per-user limit
        if (userId != null && !rateLimiter.isAllowed("user:" + userId, USER_LIMIT, WINDOW_SECONDS)) {
            sendRateLimitResponse(response, "User rate limit exceeded");
            return;
        }
        
        // Check global/IP limit
        if (!rateLimiter.isAllowed("ip:" + clientIp, GLOBAL_LIMIT, WINDOW_SECONDS)) {
            sendRateLimitResponse(response, "Rate limit exceeded");
            return;
        }
        
        // Add rate limit headers
        response.addHeader("X-RateLimit-Limit", String.valueOf(USER_LIMIT));
        response.addHeader("X-RateLimit-Remaining", 
            String.valueOf(rateLimiter.getRemainingRequests("user:" + userId)));
        
        filterChain.doFilter(request, response);
    }
    
    private void sendRateLimitResponse(HttpServletResponse response, String message) 
            throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
```

---

## 6. Circuit Breaker

### Answer
I use Resilience4j to prevent cascading failures by stopping calls to unhealthy services.

### Key Points
- States: CLOSED, OPEN, HALF-OPEN

### Senior Insight
- Tune thresholds
- Combine with monitoring

### Circuit Breaker States

```
CLOSED ──(failures exceed threshold)──> OPEN
                                          │
                                    (wait duration)
                                          │
                                          ▼
CLOSED <──(success)────────────────── HALF-OPEN
         (or failure -> OPEN)
```

### Code Example: Resilience4j Configuration

```yaml
# application.yml
resilience4j:
  circuitbreaker:
    instances:
      paymentService:
        registerHealthIndicator: true
        slidingWindowType: COUNT_BASED
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 30s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
        recordExceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException
        ignoreExceptions:
          - com.example.BusinessException
```

### Code Example: Circuit Breaker with Fallback

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentGatewayClient paymentGatewayClient;
    private final PaymentRepository paymentRepository;
    
    @CircuitBreaker(name = "paymentService", fallbackMethod = "processPaymentFallback")
    @Retry(name = "paymentService")
    @TimeLimiter(name = "paymentService")
    public CompletableFuture<PaymentResponse> processPayment(PaymentRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("Processing payment for order: {}", request.getOrderId());
            return paymentGatewayClient.charge(request);
        });
    }
    
    // Fallback method - must have same signature + Throwable
    public CompletableFuture<PaymentResponse> processPaymentFallback(
            PaymentRequest request, Throwable throwable) {
        log.warn("Payment service unavailable, using fallback. Error: {}", 
            throwable.getMessage());
        
        // Option 1: Return cached/default response
        // Option 2: Queue for retry
        // Option 3: Use backup payment provider
        
        Payment pendingPayment = Payment.builder()
            .orderId(request.getOrderId())
            .amount(request.getAmount())
            .status(PaymentStatus.PENDING_RETRY)
            .build();
        paymentRepository.save(pendingPayment);
        
        return CompletableFuture.completedFuture(
            PaymentResponse.builder()
                .status("PENDING")
                .message("Payment queued for processing")
                .build()
        );
    }
}
```

### Code Example: Circuit Breaker Event Monitoring

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class CircuitBreakerEventListener {
    
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final MeterRegistry meterRegistry;
    
    @PostConstruct
    public void registerEventListeners() {
        circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
            circuitBreaker.getEventPublisher()
                .onStateTransition(event -> {
                    log.warn("Circuit breaker {} state changed: {} -> {}",
                        event.getCircuitBreakerName(),
                        event.getStateTransition().getFromState(),
                        event.getStateTransition().getToState());
                    
                    // Send alert if circuit opens
                    if (event.getStateTransition().getToState() == CircuitBreaker.State.OPEN) {
                        alertService.sendAlert("Circuit breaker OPEN: " + 
                            event.getCircuitBreakerName());
                    }
                })
                .onFailureRateExceeded(event -> 
                    log.warn("Failure rate exceeded: {}", event.getFailureRate()))
                .onError(event -> 
                    meterRegistry.counter("circuit_breaker_errors", 
                        "name", event.getCircuitBreakerName()).increment());
        });
    }
}
```

---

## 7. Retries, Timeouts, Bulkheads

### Answer
I configure retries with backoff and timeouts to handle transient failures.

### Key Points
- Retry only idempotent operations
- Timeout prevents resource blocking

### Senior Insight
- Exponential backoff with jitter
- Bulkhead isolation

### Code Example: Retry Configuration

```yaml
# application.yml
resilience4j:
  retry:
    instances:
      externalApi:
        maxAttempts: 3
        waitDuration: 500ms
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2
        retryExceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException
        ignoreExceptions:
          - com.example.BusinessException
  
  timelimiter:
    instances:
      externalApi:
        timeoutDuration: 5s
        cancelRunningFuture: true
  
  bulkhead:
    instances:
      externalApi:
        maxConcurrentCalls: 25
        maxWaitDuration: 0ms # Fail fast
```

### Code Example: Exponential Backoff with Jitter

```java
@Component
public class RetryableHttpClient {
    
    private static final int MAX_RETRIES = 3;
    private static final long BASE_DELAY_MS = 1000;
    private static final double JITTER_FACTOR = 0.5;
    
    public <T> T executeWithRetry(Supplier<T> operation) {
        int attempt = 0;
        Exception lastException = null;
        
        while (attempt < MAX_RETRIES) {
            try {
                return operation.get();
            } catch (RetryableException e) {
                lastException = e;
                attempt++;
                
                if (attempt < MAX_RETRIES) {
                    long delay = calculateBackoffWithJitter(attempt);
                    log.warn("Attempt {} failed, retrying in {}ms", attempt, delay);
                    sleep(delay);
                }
            }
        }
        
        throw new MaxRetriesExceededException("Max retries exceeded", lastException);
    }
    
    private long calculateBackoffWithJitter(int attempt) {
        // Exponential: 1000, 2000, 4000, 8000...
        long exponentialDelay = (long) (BASE_DELAY_MS * Math.pow(2, attempt - 1));
        
        // Add jitter: ±50% of delay
        double jitter = (Math.random() - 0.5) * 2 * JITTER_FACTOR;
        long jitterDelay = (long) (exponentialDelay * (1 + jitter));
        
        // Cap at 30 seconds
        return Math.min(jitterDelay, 30000);
    }
}
```

### Code Example: Bulkhead Pattern

```java
@Service
@Slf4j
public class ExternalServiceClient {
    
    // Thread pool bulkhead - isolates slow services
    @Bulkhead(name = "inventoryService", type = Bulkhead.Type.THREADPOOL)
    public CompletableFuture<InventoryResponse> checkInventory(String productId) {
        return CompletableFuture.supplyAsync(() -> 
            inventoryClient.check(productId)
        );
    }
    
    // Semaphore bulkhead - limits concurrent calls
    @Bulkhead(name = "paymentService", type = Bulkhead.Type.SEMAPHORE, 
              fallbackMethod = "paymentFallback")
    public PaymentResponse processPayment(PaymentRequest request) {
        return paymentClient.process(request);
    }
    
    public PaymentResponse paymentFallback(PaymentRequest request, 
                                           BulkheadFullException ex) {
        log.warn("Payment bulkhead full, request queued");
        return PaymentResponse.pending("Service busy, request queued");
    }
}
```

### Code Example: Combined Resilience Patterns

```java
@Service
@RequiredArgsConstructor
public class ResilientOrderService {
    
    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;
    
    @CircuitBreaker(name = "order", fallbackMethod = "createOrderFallback")
    @Bulkhead(name = "order")
    @Retry(name = "order")
    @TimeLimiter(name = "order")
    public CompletableFuture<OrderResponse> createOrder(OrderRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            // Check inventory
            InventoryResponse inventory = inventoryClient.reserve(request.getItems());
            
            // Process payment
            PaymentResponse payment = paymentClient.charge(request.getPayment());
            
            // Create order
            return orderRepository.save(Order.from(request, inventory, payment));
        });
    }
}
```

---

## 8. Caching (Redis)

### Answer
I use Redis to cache frequently accessed data and reduce database load.

### Key Points
- TTL (Time-to-live)
- Cache eviction

### Senior Insight
- Cache-aside pattern
- Cache invalidation strategies

### Caching Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Cache-Aside | App manages cache | Read-heavy, infrequent updates |
| Write-Through | Write to cache + DB together | Data consistency critical |
| Write-Behind | Write to cache, async to DB | High write throughput |
| Read-Through | Cache fetches from DB on miss | Simplify application code |

### Code Example: Spring Cache Configuration

```java
@Configuration
@EnableCaching
public class RedisConfig {
    
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()));
        
        Map<String, RedisCacheConfiguration> cacheConfigs = Map.of(
            "products", defaultConfig.entryTtl(Duration.ofHours(1)),
            "users", defaultConfig.entryTtl(Duration.ofMinutes(30)),
            "sessions", defaultConfig.entryTtl(Duration.ofHours(24))
        );
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigs)
            .build();
    }
}
```

### Code Example: Cache-Aside Pattern

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    
    private final ProductRepository productRepository;
    private final RedisTemplate<String, Product> redisTemplate;
    
    private static final String CACHE_PREFIX = "product:";
    private static final Duration CACHE_TTL = Duration.ofHours(1);
    
    // Using Spring @Cacheable
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public Product getProduct(Long id) {
        log.info("Cache miss - fetching from database: {}", id);
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
    
    // Manual cache-aside implementation
    public Product getProductManual(Long id) {
        String cacheKey = CACHE_PREFIX + id;
        
        // 1. Check cache
        Product cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.debug("Cache hit: {}", id);
            return cached;
        }
        
        // 2. Fetch from database
        log.debug("Cache miss: {}", id);
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // 3. Populate cache
        redisTemplate.opsForValue().set(cacheKey, product, CACHE_TTL);
        
        return product;
    }
    
    @CacheEvict(value = "products", key = "#id")
    public Product updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        
        return productRepository.save(product);
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public void clearProductCache() {
        log.info("Clearing all product cache");
    }
}
```

### Code Example: Cache Invalidation Strategies

```java
@Service
@RequiredArgsConstructor
public class CacheInvalidationService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    // 1. Time-based expiration (TTL)
    public void cacheWithTTL(String key, Object value, Duration ttl) {
        redisTemplate.opsForValue().set(key, value, ttl);
    }
    
    // 2. Event-driven invalidation
    @EventListener
    public void onProductUpdated(ProductUpdatedEvent event) {
        String cacheKey = "product:" + event.getProductId();
        redisTemplate.delete(cacheKey);
        
        // Also invalidate related caches
        redisTemplate.delete("category:" + event.getCategoryId() + ":products");
    }
    
    // 3. Write-through (update cache on write)
    @Transactional
    public Product updateProductWriteThrough(Long id, UpdateProductRequest request) {
        Product product = productRepository.save(
            productRepository.findById(id)
                .map(p -> { p.update(request); return p; })
                .orElseThrow()
        );
        
        // Immediately update cache
        redisTemplate.opsForValue().set("product:" + id, product, Duration.ofHours(1));
        
        return product;
    }
    
    // 4. Pattern-based invalidation
    public void invalidatePattern(String pattern) {
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
}
```

---

## 9. Connection Pooling & DB Performance

### Answer
I configure connection pools (HikariCP) and optimize queries with indexing.

### Key Points
- Avoid N+1 problem
- Efficient joins

### Senior Insight
- Query execution plans
- Read replicas
- Pool tuning

### Code Example: HikariCP Configuration

```yaml
# application.yml
spring:
  datasource:
    hikari:
      # Pool sizing
      minimum-idle: 5
      maximum-pool-size: 20
      
      # Connection timeout
      connection-timeout: 30000      # 30 seconds
      idle-timeout: 600000           # 10 minutes
      max-lifetime: 1800000          # 30 minutes
      
      # Validation
      validation-timeout: 5000
      
      # Leak detection
      leak-detection-threshold: 60000  # 1 minute
      
      # Pool name for monitoring
      pool-name: RetailManagementPool
```

### Connection Pool Sizing Formula

```
Pool Size = Tn × (Cm - 1) + 1

Where:
- Tn = Number of threads
- Cm = Number of simultaneous connections per thread

For most applications:
connections = ((core_count * 2) + effective_spindle_count)

Example: 4-core server with SSD
connections = (4 * 2) + 1 = 9-10 connections
```

### Code Example: N+1 Problem and Solutions

```java
// BAD: N+1 Problem
@Entity
public class Order {
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderItem> items;
}

// This causes N+1 queries (1 for orders + N for each order's items)
public List<OrderDto> getAllOrders() {
    List<Order> orders = orderRepository.findAll(); // 1 query
    return orders.stream()
        .map(order -> {
            // Each call triggers a new query
            List<OrderItem> items = order.getItems(); // N queries
            return OrderDto.from(order, items);
        })
        .toList();
}

// SOLUTION 1: JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.status = :status")
List<Order> findByStatusWithItems(@Param("status") OrderStatus status);

// SOLUTION 2: EntityGraph
@EntityGraph(attributePaths = {"items", "items.product"})
List<Order> findByStatus(OrderStatus status);

// SOLUTION 3: Batch fetching
@Entity
public class Order {
    @OneToMany(mappedBy = "order")
    @BatchSize(size = 25)  // Fetch items for 25 orders at once
    private List<OrderItem> items;
}
```

### Code Example: Query Optimization with Indexes

```sql
-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT * FROM orders 
WHERE customer_id = 123 
  AND status = 'PENDING' 
  AND created_at > '2024-01-01';

-- Create composite index for common query patterns
CREATE INDEX idx_orders_customer_status_date 
ON orders (customer_id, status, created_at DESC);

-- Partial index for frequently filtered data
CREATE INDEX idx_orders_pending 
ON orders (customer_id, created_at) 
WHERE status = 'PENDING';
```

### Code Example: Read Replica Configuration

```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    @Primary
    public DataSource dataSource() {
        return new LazyConnectionDataSourceProxy(routingDataSource());
    }
    
    @Bean
    public DataSource routingDataSource() {
        ReplicationRoutingDataSource routingDataSource = new ReplicationRoutingDataSource();
        
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put(DataSourceType.PRIMARY, primaryDataSource());
        dataSourceMap.put(DataSourceType.REPLICA, replicaDataSource());
        
        routingDataSource.setTargetDataSources(dataSourceMap);
        routingDataSource.setDefaultTargetDataSource(primaryDataSource());
        
        return routingDataSource;
    }
}

public class ReplicationRoutingDataSource extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly() 
            ? DataSourceType.REPLICA 
            : DataSourceType.PRIMARY;
    }
}

// Usage
@Service
public class ProductService {
    
    @Transactional(readOnly = true)  // Routes to replica
    public List<Product> getProducts() {
        return productRepository.findAll();
    }
    
    @Transactional  // Routes to primary
    public Product createProduct(CreateProductRequest request) {
        return productRepository.save(Product.from(request));
    }
}
```

---

## 10. API vs Event-based Integration

### Answer
I use REST for synchronous communication and event-driven systems (Kafka) for asynchronous processing.

### Key Points
- Sync = immediate response
- Async = eventual consistency

### Senior Insight
- Define service boundaries
- Use event-driven for scalability

### Comparison Table

| Aspect | Synchronous (REST) | Asynchronous (Events) |
|--------|-------------------|----------------------|
| Coupling | Tight | Loose |
| Response | Immediate | Eventually |
| Failure Handling | Caller handles | Retry/DLQ |
| Scalability | Limited | High |
| Complexity | Simple | Higher |
| Use Case | CRUD, queries | Notifications, workflows |

### Code Example: Synchronous API Call

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;
    
    // Synchronous - blocks until all services respond
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // 1. Check inventory (sync call)
        InventoryResponse inventory = inventoryClient.reserve(request.getItems());
        if (!inventory.isAvailable()) {
            throw new InsufficientInventoryException("Items not available");
        }
        
        // 2. Process payment (sync call)
        PaymentResponse payment = paymentClient.charge(request.getPayment());
        if (!payment.isSuccessful()) {
            inventoryClient.release(inventory.getReservationId());
            throw new PaymentFailedException("Payment failed");
        }
        
        // 3. Create order
        Order order = Order.create(request, inventory, payment);
        return orderRepository.save(order);
    }
}
```

### Code Example: Event-Driven Architecture

```java
// Domain Event
@Value
public class OrderCreatedEvent {
    String eventId = UUID.randomUUID().toString();
    LocalDateTime timestamp = LocalDateTime.now();
    Long orderId;
    Long customerId;
    List<OrderItem> items;
    BigDecimal totalAmount;
}

// Event Publisher
@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final OrderRepository orderRepository;
    
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // Create order in PENDING state
        Order order = Order.create(request);
        order = orderRepository.save(order);
        
        // Publish event for async processing
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getCustomerId(),
            order.getItems(),
            order.getTotalAmount()
        );
        
        kafkaTemplate.send("order.created", order.getId().toString(), event);
        
        return order;
    }
}

// Inventory Service - Event Consumer
@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryEventHandler {
    
    private final InventoryService inventoryService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @KafkaListener(topics = "order.created", groupId = "inventory-service")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Processing order: {}", event.getOrderId());
        
        try {
            inventoryService.reserve(event.getOrderId(), event.getItems());
            
            kafkaTemplate.send("inventory.reserved", 
                new InventoryReservedEvent(event.getOrderId()));
                
        } catch (InsufficientInventoryException e) {
            kafkaTemplate.send("inventory.reservation.failed",
                new InventoryReservationFailedEvent(event.getOrderId(), e.getMessage()));
        }
    }
}
```

### Code Example: Saga Pattern for Distributed Transactions

```java
// Choreography-based Saga
@Service
@Slf4j
public class OrderSagaOrchestrator {
    
    @KafkaListener(topics = "inventory.reserved")
    public void onInventoryReserved(InventoryReservedEvent event) {
        log.info("Inventory reserved for order: {}", event.getOrderId());
        kafkaTemplate.send("payment.process", 
            new ProcessPaymentCommand(event.getOrderId()));
    }
    
    @KafkaListener(topics = "payment.completed")
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Payment completed for order: {}", event.getOrderId());
        orderService.confirmOrder(event.getOrderId());
        kafkaTemplate.send("notification.send",
            new SendOrderConfirmationCommand(event.getOrderId()));
    }
    
    @KafkaListener(topics = "payment.failed")
    public void onPaymentFailed(PaymentFailedEvent event) {
        log.info("Payment failed for order: {}, compensating...", event.getOrderId());
        // Compensate - release inventory
        kafkaTemplate.send("inventory.release",
            new ReleaseInventoryCommand(event.getOrderId()));
        orderService.cancelOrder(event.getOrderId());
    }
    
    @KafkaListener(topics = "inventory.reservation.failed")
    public void onInventoryFailed(InventoryReservationFailedEvent event) {
        log.info("Inventory reservation failed for order: {}", event.getOrderId());
        orderService.cancelOrder(event.getOrderId());
    }
}
```

---

## 11. Kafka

### Answer
I produce and consume messages with Kafka, ensuring proper partitioning and ordering.

### Key Points
- Partitioning by key
- Ordering per partition

### Senior Insight
- Idempotency
- Retry & Dead Letter Queue
- Delivery guarantees

### Kafka Delivery Guarantees

| Guarantee | Description | Trade-off |
|-----------|-------------|-----------|
| At-most-once | May lose messages | Fastest, no duplicates |
| At-least-once | May duplicate messages | Safe, need idempotency |
| Exactly-once | No loss, no duplicates | Slowest, complex |

### Code Example: Kafka Producer Configuration

```java
@Configuration
public class KafkaProducerConfig {
    
    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        
        // Idempotent producer (prevents duplicates)
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
        config.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 5);
        
        return new DefaultKafkaProducerFactory<>(config);
    }
    
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
```

### Code Example: Kafka Consumer with Error Handling

```java
@Configuration
@EnableKafka
public class KafkaConsumerConfig {
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3);
        
        // Error handling with retry and DLQ
        factory.setCommonErrorHandler(new DefaultErrorHandler(
            new DeadLetterPublishingRecoverer(kafkaTemplate()),
            new ExponentialBackOff(1000L, 2.0)  // 1s, 2s, 4s...
        ));
        
        // Manual acknowledgment for at-least-once
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        
        return factory;
    }
    
    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "order-service");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        
        // Manual offset commit
        config.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        
        return new DefaultKafkaConsumerFactory<>(config);
    }
}
```

### Code Example: Idempotent Consumer

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {
    
    private final ProcessedEventRepository processedEventRepository;
    private final OrderService orderService;
    
    @KafkaListener(topics = "payment.completed", groupId = "order-service")
    @Transactional
    public void handlePaymentCompleted(
            PaymentCompletedEvent event,
            Acknowledgment acknowledgment,
            @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        
        String eventId = event.getEventId();
        
        // Check if already processed (idempotency)
        if (processedEventRepository.existsById(eventId)) {
            log.info("Event already processed: {}", eventId);
            acknowledgment.acknowledge();
            return;
        }
        
        try {
            // Process event
            orderService.confirmOrder(event.getOrderId());
            
            // Mark as processed
            processedEventRepository.save(new ProcessedEvent(eventId, LocalDateTime.now()));
            
            // Acknowledge
            acknowledgment.acknowledge();
            
        } catch (Exception e) {
            log.error("Failed to process event: {}", eventId, e);
            // Don't acknowledge - will be retried or sent to DLQ
            throw e;
        }
    }
}
```

### Code Example: Partitioning Strategy

```java
@Service
@RequiredArgsConstructor
public class OrderEventPublisher {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public void publishOrderEvent(OrderEvent event) {
        // Use orderId as key to ensure all events for same order
        // go to same partition (maintains ordering)
        String key = event.getOrderId().toString();
        
        kafkaTemplate.send("orders", key, event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish event: {}", event, ex);
                } else {
                    log.info("Event published to partition {}, offset {}",
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
                }
            });
    }
}
```

---

## 12. Database & Schema Design

### Answer
I design normalized schemas and manage migrations using tools like Flyway.

### Key Points
- Relationships (OneToMany, ManyToOne)
- Indexing

### Senior Insight
- Schema evolution
- Denormalization when needed
- Performance optimization

### Normalization Forms

| Form | Description | Example |
|------|-------------|---------|
| 1NF | Atomic values, no repeating groups | Split CSV into rows |
| 2NF | 1NF + no partial dependencies | Separate product info from order |
| 3NF | 2NF + no transitive dependencies | Separate category name from product |

### Code Example: Entity Relationships

```java
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String orderNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Helper methods for bidirectional relationship
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}

@Entity
@Table(name = "order_items")
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;
}
```

### Code Example: Flyway Migration

```sql
-- V1__create_orders_schema.sql
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Indexes for common queries
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### Code Example: Schema Evolution (Adding Column)

```sql
-- V2__add_shipping_address.sql
-- Step 1: Add nullable column
ALTER TABLE orders ADD COLUMN shipping_address_id BIGINT;

-- Step 2: Backfill data (if needed)
UPDATE orders o 
SET shipping_address_id = (
    SELECT id FROM addresses a 
    WHERE a.customer_id = o.customer_id 
    AND a.is_default = true
    LIMIT 1
);

-- Step 3: Add constraint (after backfill)
-- This would be in a separate migration after data is populated
-- ALTER TABLE orders ALTER COLUMN shipping_address_id SET NOT NULL;
```

### Code Example: Denormalization for Read Performance

```java
// Normalized: requires joins
@Entity
public class OrderSummary {  // Read model / View
    
    @Id
    private Long orderId;
    
    // Denormalized customer info
    private String customerName;
    private String customerEmail;
    
    // Denormalized product info (JSON or separate table)
    @Column(columnDefinition = "jsonb")
    private String itemsSummary;
    
    private Integer totalItems;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
}

// Materialized view in PostgreSQL
-- CREATE MATERIALIZED VIEW order_summaries AS
-- SELECT 
--     o.id as order_id,
--     c.name as customer_name,
--     c.email as customer_email,
--     COUNT(oi.id) as total_items,
--     o.total_amount,
--     o.status,
--     o.created_at
-- FROM orders o
-- JOIN customers c ON o.customer_id = c.id
-- LEFT JOIN order_items oi ON o.id = oi.order_id
-- GROUP BY o.id, c.id;
```

---

## 13. Availability / Uptime (4 Nines)

### Answer
4-nines availability means the system is available 99.99% of the time, allowing only about 52 minutes of downtime per year.

### Downtime Calculation

Availability = (Total Time - Downtime) / Total Time

### Allowed Downtime
- Yearly: ~52.6 minutes
- Monthly: ~4.38 minutes
- Daily: ~8.6 seconds

### Comparison

| Availability | Downtime/year | Downtime/month | Downtime/day |
|-------------|--------------|----------------|--------------|
| 99%         | ~3.65 days   | ~7.3 hours | ~14 minutes |
| 99.9%       | ~8.7 hours   | ~43 minutes | ~86 seconds |
| 99.99%      | ~52 minutes  | ~4.3 minutes | ~8.6 seconds |
| 99.999%     | ~5 minutes   | ~26 seconds | ~0.86 seconds |

### Senior Insight
- Design for failure: every component should be replaceable
- Use canary deployments for risky changes
- Implement proper observability (metrics, logs, traces)
- Define SLI/SLO and measure against them
- Plan capacity based on traffic patterns

### Strategies for High Availability

| Strategy | Description | Impact |
|----------|-------------|--------|
| Multi-AZ | Deploy across availability zones | Survives AZ failures |
| Load Balancing | Distribute traffic across instances | No single point of failure |
| Health Checks | Monitor and remove unhealthy instances | Fast failure detection |
| Auto Scaling | Scale based on demand | Handle traffic spikes |
| Rolling Deployments | Zero-downtime updates | No deployment downtime |
| Database Replication | Primary + replicas | Database resilience |

### Code Example: Health Check Endpoints

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    private final DataSource dataSource;
    
    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(5)) {
                return Health.up()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("connectionValid", true)
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
        return Health.down().build();
    }
}

@RestController
@RequestMapping("/health")
public class HealthController {
    
    private final HealthEndpoint healthEndpoint;
    
    @GetMapping("/live")
    public ResponseEntity<Map<String, String>> liveness() {
        // Kubernetes liveness probe - is the app running?
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
    
    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        // Kubernetes readiness probe - can it serve traffic?
        HealthComponent health = healthEndpoint.health();
        boolean isReady = health.getStatus() == Status.UP;
        
        return isReady 
            ? ResponseEntity.ok(Map.of("status", "UP"))
            : ResponseEntity.status(503).body(Map.of("status", "DOWN"));
    }
}
```

### Code Example: Kubernetes Zero-Downtime Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: retail-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Add 1 extra pod during update
      maxUnavailable: 0  # Always keep all pods available
  template:
    spec:
      containers:
      - name: api
        image: retail-api:v2.0.0
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        lifecycle:
          preStop:
            exec:
              # Graceful shutdown: wait for in-flight requests
              command: ["sh", "-c", "sleep 10"]
```

### Important Notes
- Availability ≠ reliability (system can be available but return wrong results)
- Availability ≠ latency (slow response is still "available")
- Combine with SLI/SLO metrics for complete picture

---

## Final Summary Answer (Use in Interview)

I've worked extensively with Spring Boot to design RESTful services using **clean architecture** and **dependency injection**. I structure applications with clear separation of concerns using controller-service-repository layers, and for complex domains, I apply hexagonal architecture.

For **authentication and authorization**, I implement OAuth2 and JWT-based security with proper token refresh strategies, role-based access control, and secure password handling using BCrypt.

I design **REST APIs** following best practices: proper HTTP methods, status codes, pagination, filtering, versioning, and idempotency for critical operations. I document APIs using OpenAPI/Swagger.

To ensure system **resilience**, I apply patterns like:
- **Circuit breakers** (Resilience4j) to prevent cascading failures
- **Retries** with exponential backoff and jitter
- **Bulkheads** for resource isolation
- **Rate limiting** to protect services from abuse

For **performance optimization**:
- **Caching** with Redis using cache-aside pattern
- **Connection pooling** with HikariCP
- **Database optimization** with proper indexing, avoiding N+1 problems
- **Read replicas** for read-heavy workloads

I understand **when to use synchronous APIs versus event-driven architecture**:
- REST for immediate responses and CRUD operations
- Kafka for async processing, eventual consistency, and system decoupling
- Saga patterns for distributed transactions

For **high availability** (targeting 99.99%):
- Multi-AZ deployments with redundancy
- Load balancing and health checks
- Zero-downtime rolling deployments
- Comprehensive monitoring with SLI/SLO metrics

I follow **security best practices**: input validation, parameterized queries to prevent SQL injection, proper authentication/authorization, and awareness of OWASP Top 10 vulnerabilities.
