# Java Annotations Guide

A comprehensive reference for all annotations used in the Retail Management backend source code.

---

## Table of Contents

1. [Spring Framework (Core)](#1-spring-framework-core)
2. [Spring Web/REST](#2-spring-webrest)
3. [Spring Security](#3-spring-security)
4. [Spring Data JPA](#4-spring-data-jpa)
5. [JPA/Hibernate (Persistence)](#5-jpahibernate-persistence)
6. [JPA Auditing](#6-jpa-auditing)
7. [Lombok](#7-lombok)
8. [Bean Validation](#8-bean-validation-jakartavalidation)
9. [OpenAPI/Swagger](#9-openapiswagger-springdoc)
10. [Jackson (JSON)](#10-jackson-json-serialization)
11. [Java Standard](#11-java-standard)

---

## 1. Spring Framework (Core)

### @SpringBootApplication

**Package:** `org.springframework.boot.autoconfigure`

**Purpose:** The main entry point for a Spring Boot application. It's a convenience annotation that combines three annotations.

**Combines:**
- `@Configuration` - Marks the class as a source of bean definitions
- `@EnableAutoConfiguration` - Enables Spring Boot's auto-configuration
- `@ComponentScan` - Enables component scanning in the current package and sub-packages

```java
@SpringBootApplication
public class RetailManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(RetailManagementApplication.class, args);
    }
}
```

**Used in:** [RetailManagementApplication.java](../../src/backend/src/main/java/com/retailmanagement/RetailManagementApplication.java)

---

### @Configuration

**Package:** `org.springframework.context.annotation`

**Purpose:** Indicates that a class declares one or more `@Bean` methods and may be processed by the Spring container to generate bean definitions.

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Key Points:**
- Replaces XML-based configuration
- Classes annotated with `@Configuration` are themselves registered as beans
- `@Bean` methods within are called to create beans

**Used in:** [JpaConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/JpaConfig.java), [SecurityConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/SecurityConfig.java)

---

### @Bean

**Package:** `org.springframework.context.annotation`

**Purpose:** Indicates that a method produces a bean to be managed by the Spring container.

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

**Key Points:**
- Method name becomes the bean name by default
- Can specify name: `@Bean(name = "customName")`
- Can specify init/destroy methods: `@Bean(initMethod = "init", destroyMethod = "cleanup")`

**Used in:** [JpaConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/JpaConfig.java), [SecurityConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/SecurityConfig.java)

---

### @Component

**Package:** `org.springframework.stereotype`

**Purpose:** Indicates that a class is a Spring component. It's a generic stereotype for any Spring-managed component.

```java
@Component
public class JwtTokenProvider {
    // Spring will automatically create and manage this bean
}
```

**Key Points:**
- Auto-detected during classpath scanning
- Base annotation for `@Service`, `@Repository`, `@Controller`
- Use when the class doesn't fit a more specific stereotype

**Used in:** [JwtAuthenticationFilter.java](../../src/backend/src/main/java/com/retailmanagement/common/security/JwtAuthenticationFilter.java), [JwtProperties.java](../../src/backend/src/main/java/com/retailmanagement/common/security/JwtProperties.java), [JwtTokenProvider.java](../../src/backend/src/main/java/com/retailmanagement/common/security/JwtTokenProvider.java), [TenantContext.java](../../src/backend/src/main/java/com/retailmanagement/common/security/TenantContext.java)

---

### @Service

**Package:** `org.springframework.stereotype`

**Purpose:** Indicates that a class is a "Service" in the business layer. It's a specialization of `@Component`.

```java
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }
}
```

**Key Points:**
- Semantically indicates business logic
- Functionally equivalent to `@Component`
- May have additional behavior in future Spring versions (e.g., transaction handling)

**Used in:** [CustomUserDetailsService.java](../../src/backend/src/main/java/com/retailmanagement/common/security/CustomUserDetailsService.java), [AuthServiceImpl.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/service/impl/AuthServiceImpl.java)

---

### @Repository

**Package:** `org.springframework.stereotype`

**Purpose:** Indicates that a class is a "Repository" (Data Access Object). It's a specialization of `@Component`.

```java
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}
```

**Key Points:**
- Indicates data access layer
- Enables automatic exception translation (converts database exceptions to Spring's `DataAccessException`)
- With Spring Data JPA, interfaces extending `JpaRepository` are auto-implemented

**Used in:** All repository files in `infrastructure/persistence/repository/`

---

### @ConfigurationProperties

**Package:** `org.springframework.boot.context.properties`

**Purpose:** Binds external configuration properties (from `application.yml` or `application.properties`) to a Java class.

```java
@Component
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {
    private String secret;
    private long accessTokenExpiration;
    private long refreshTokenExpiration;
}
```

```yaml
# application.yml
jwt:
  secret: mySecretKey
  access-token-expiration: 3600000
  refresh-token-expiration: 604800000
```

**Key Points:**
- Needs `@EnableConfigurationProperties` or `@Component` to work
- Type-safe configuration binding
- Supports nested properties, lists, and maps
- Kebab-case in YAML maps to camelCase in Java

**Used in:** [JwtProperties.java](../../src/backend/src/main/java/com/retailmanagement/common/security/JwtProperties.java)

---

### @Value

**Package:** `org.springframework.beans.factory.annotation`

**Purpose:** Injects values from properties files or SpEL expressions into fields or parameters.

```java
@Configuration
public class SecurityConfig {
    
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;
    
    @Value("${app.jwt.secret:defaultSecret}")  // With default value
    private String jwtSecret;
    
    @Value("#{systemProperties['user.home']}")  // SpEL expression
    private String userHome;
}
```

**Key Points:**
- Simpler than `@ConfigurationProperties` for single values
- Supports default values with `:` syntax
- Supports SpEL expressions with `#{}` syntax
- Can inject into fields, constructor params, or method params

**Used in:** [SecurityConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/SecurityConfig.java)

---

### @RequestScope

**Package:** `org.springframework.web.context.annotation`

**Purpose:** Indicates that a bean should be created once per HTTP request.

```java
@Component
@RequestScope
public class TenantContext {
    
    private UUID tenantId;
    
    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }
    
    public UUID getTenantId() {
        return this.tenantId;
    }
}
```

**Key Points:**
- Bean is created fresh for each HTTP request
- Useful for request-specific data (tenant ID, user context)
- Other scopes: `@SessionScope`, `@ApplicationScope`

**Used in:** [TenantContext.java](../../src/backend/src/main/java/com/retailmanagement/common/security/TenantContext.java)

---

## 2. Spring Web/REST

### @RestController

**Package:** `org.springframework.web.bind.annotation`

**Purpose:** A convenience annotation combining `@Controller` and `@ResponseBody`. Indicates that every method returns a domain object instead of a view.

```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Returns JSON automatically
        return ResponseEntity.ok(authService.login(request));
    }
}
```

**Key Points:**
- Methods return JSON/XML by default (no need for `@ResponseBody` on each method)
- Combines `@Controller` + `@ResponseBody`
- Use `@Controller` when returning views (Thymeleaf, JSP)

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

### @RestControllerAdvice

**Package:** `org.springframework.web.bind.annotation`

**Purpose:** A specialization of `@ControllerAdvice` + `@ResponseBody`. Handles exceptions globally across all controllers.

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("Internal server error"));
    }
}
```

**Key Points:**
- Centralizes exception handling
- Applies to all controllers
- Can target specific controllers: `@RestControllerAdvice(assignableTypes = {UserController.class})`

**Used in:** [GlobalExceptionHandler.java](../../src/backend/src/main/java/com/retailmanagement/common/exception/GlobalExceptionHandler.java)

---

### @RequestMapping

**Package:** `org.springframework.web.bind.annotation`

**Purpose:** Maps HTTP requests to handler methods or classes. Defines the base URL path for a controller.

```java
@RestController
@RequestMapping("/api/v1/auth")  // Base path for all methods
public class AuthController {
    
    @RequestMapping(value = "/status", method = RequestMethod.GET)
    public String status() {
        return "OK";
    }
}
```

**Key Points:**
- Can specify: `path`, `method`, `params`, `headers`, `consumes`, `produces`
- Usually used at class level for base path
- Method-level: prefer `@GetMapping`, `@PostMapping`, etc.

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

### @PostMapping

**Package:** `org.springframework.web.bind.annotation`

**Purpose:** Shortcut for `@RequestMapping(method = RequestMethod.POST)`. Maps HTTP POST requests.

```java
@PostMapping("/signup")
public ResponseEntity<ApiResponse<AuthResponse>> signUp(
        @Valid @RequestBody SignUpRequest request) {
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(ApiResponse.success("User registered", authService.signUp(request)));
}
```

**Related Annotations:**
- `@GetMapping` - HTTP GET
- `@PutMapping` - HTTP PUT
- `@DeleteMapping` - HTTP DELETE
- `@PatchMapping` - HTTP PATCH

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

### @RequestBody

**Package:** `org.springframework.web.bind.annotation`

**Purpose:** Binds the HTTP request body to a method parameter. Automatically deserializes JSON/XML to Java object.

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(
        @RequestBody LoginRequest request) {  // JSON → Java object
    return ResponseEntity.ok(authService.login(request));
}
```

**Key Points:**
- Uses `HttpMessageConverter` for deserialization
- Default: Jackson for JSON
- Combine with `@Valid` for validation

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

### @ExceptionHandler

**Package:** `org.springframework.web.bind.annotation`

**Purpose:** Marks a method as a handler for specific exception types.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage
            ));
        
        return ResponseEntity
            .badRequest()
            .body(ApiResponse.error("Validation failed", errors));
    }
    
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(RuntimeException ex) {
        return ResponseEntity
            .badRequest()
            .body(ApiResponse.error(ex.getMessage()));
    }
}
```

**Key Points:**
- Can handle multiple exception types
- Most specific handler wins
- Works in `@Controller`, `@RestController`, or `@ControllerAdvice`

**Used in:** [GlobalExceptionHandler.java](../../src/backend/src/main/java/com/retailmanagement/common/exception/GlobalExceptionHandler.java)

---

## 3. Spring Security

### @EnableWebSecurity

**Package:** `org.springframework.security.config.annotation.web.configuration`

**Purpose:** Enables Spring Security's web security support and provides the Spring MVC integration.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .build();
    }
}
```

**Key Points:**
- Required for custom security configuration
- Automatically applies Spring Security's filter chain
- Must be on a `@Configuration` class

**Used in:** [SecurityConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/SecurityConfig.java)

---

### @EnableMethodSecurity

**Package:** `org.springframework.security.config.annotation.method.configuration`

**Purpose:** Enables method-level security annotations like `@PreAuthorize`, `@PostAuthorize`, `@Secured`.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Enables @PreAuthorize, @PostAuthorize
public class SecurityConfig {
    // ...
}
```

**Key Points:**
- Replaces deprecated `@EnableGlobalMethodSecurity`
- Enables `@PreAuthorize` and `@PostAuthorize` by default
- For `@Secured`: `@EnableMethodSecurity(securedEnabled = true)`
- For JSR-250 (`@RolesAllowed`): `@EnableMethodSecurity(jsr250Enabled = true)`

**Used in:** [SecurityConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/SecurityConfig.java)

---

### @PreAuthorize

**Package:** `org.springframework.security.access.prepost`

**Purpose:** Authorizes method invocation before execution using SpEL expressions.

```java
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    @GetMapping("/users/{userId}")
    public User getUser(@PathVariable Long userId) {
        return userService.findById(userId);
    }
    
    @PreAuthorize("hasAuthority('user:delete')")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

**Common Expressions:**
| Expression | Description |
|------------|-------------|
| `hasRole('ADMIN')` | User has ROLE_ADMIN |
| `hasAnyRole('ADMIN', 'MANAGER')` | User has any of the roles |
| `hasAuthority('read:users')` | User has exact authority |
| `isAuthenticated()` | User is logged in |
| `#paramName == authentication.principal.id` | Access method parameter |

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

## 4. Spring Data JPA

### @EnableJpaAuditing

**Package:** `org.springframework.data.jpa.repository.config`

**Purpose:** Enables JPA auditing to automatically populate `@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy`.

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig {
    
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
            .map(SecurityContext::getAuthentication)
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getName);
    }
}
```

**Key Points:**
- Required for auditing annotations to work
- `auditorAwareRef` specifies bean for `@CreatedBy`/`@LastModifiedBy`
- Entities need `@EntityListeners(AuditingEntityListener.class)`

**Used in:** [JpaConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/JpaConfig.java)

---

### @Query

**Package:** `org.springframework.data.jpa.repository`

**Purpose:** Defines a custom JPQL or native SQL query for a repository method.

```java
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // JPQL query
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.tenant.id = :tenantId")
    Optional<User> findByEmailAndTenantId(
        @Param("email") String email, 
        @Param("tenantId") UUID tenantId
    );
    
    // Native SQL query
    @Query(value = "SELECT * FROM users WHERE created_at > :date", nativeQuery = true)
    List<User> findRecentUsers(@Param("date") LocalDateTime date);
    
    // With JOIN FETCH to avoid N+1
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") UUID id);
}
```

**Key Points:**
- JPQL by default; use `nativeQuery = true` for SQL
- Use `@Param` to bind named parameters
- Supports SpEL: `#{#entityName}` for entity name

**Used in:** [RefreshTokenRepository.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/repository/RefreshTokenRepository.java), [RoleRepository.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/repository/RoleRepository.java), [UserRepository.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/repository/UserRepository.java)

---

### @Param

**Package:** `org.springframework.data.repository.query`

**Purpose:** Binds method parameters to named query parameters.

```java
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);

@Query("SELECT u FROM User u WHERE u.status = :status AND u.tenant.id = :tenantId")
List<User> findByStatusAndTenant(
    @Param("status") UserStatus status,
    @Param("tenantId") UUID tenantId
);
```

**Used in:** All repository files with `@Query`

---

### @Modifying

**Package:** `org.springframework.data.jpa.repository`

**Purpose:** Indicates that a query method is a modifying query (UPDATE, DELETE, INSERT). Required for non-SELECT queries.

```java
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    
    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken rt WHERE rt.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.user.id = :userId")
    int revokeAllUserTokens(@Param("userId") UUID userId);
}
```

**Key Points:**
- Must be combined with `@Query`
- Requires `@Transactional` (on method or calling service)
- Use `clearAutomatically = true` to clear persistence context after execution

**Used in:** [RefreshTokenRepository.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/repository/RefreshTokenRepository.java)

---

### @Transactional

**Package:** `org.springframework.transaction.annotation`

**Purpose:** Defines the scope of a database transaction. Ensures atomicity of operations.

```java
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    @Transactional  // Read-write transaction
    public AuthResponse signUp(SignUpRequest request) {
        User user = createUser(request);
        RefreshToken token = createRefreshToken(user);
        return buildResponse(user, token);
    }
    
    @Transactional(readOnly = true)  // Read-only, optimized
    public User findById(UUID id) {
        return userRepository.findById(id).orElseThrow();
    }
    
    @Transactional(
        propagation = Propagation.REQUIRES_NEW,  // New transaction
        isolation = Isolation.READ_COMMITTED,    // Isolation level
        timeout = 30,                            // Timeout in seconds
        rollbackFor = Exception.class            // Rollback on any exception
    )
    public void criticalOperation() {
        // ...
    }
}
```

**Key Points:**
- Class-level: applies to all public methods
- `readOnly = true`: hints for optimization, no dirty checking
- Default: rolls back only on unchecked exceptions
- Use `rollbackFor` to specify checked exceptions

**Propagation Types:**
| Type | Description |
|------|-------------|
| `REQUIRED` (default) | Join existing or create new |
| `REQUIRES_NEW` | Always create new, suspend existing |
| `SUPPORTS` | Join existing or run non-transactional |
| `MANDATORY` | Must have existing, throw if none |
| `NEVER` | Throw if transaction exists |
| `NOT_SUPPORTED` | Suspend existing, run non-transactional |
| `NESTED` | Nested transaction within existing |

**Used in:** [CustomUserDetailsService.java](../../src/backend/src/main/java/com/retailmanagement/common/security/CustomUserDetailsService.java), [AuthServiceImpl.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/service/impl/AuthServiceImpl.java)

---

## 5. JPA/Hibernate (Persistence)

### @Entity

**Package:** `jakarta.persistence`

**Purpose:** Marks a class as a JPA entity (a persistent domain object mapped to a database table).

```java
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String email;
}
```

**Key Points:**
- Must have a no-arg constructor (can be `protected`)
- Must have an `@Id` field
- By default, maps to table with class name
- Use `@Table` to customize table name

**Used in:** All entity files in `infrastructure/persistence/entity/`

---

### @Table

**Package:** `jakarta.persistence`

**Purpose:** Specifies the database table for an entity. Allows customizing table name, schema, indexes, and constraints.

```java
@Entity
@Table(
    name = "users",
    schema = "public",
    indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_tenant", columnList = "tenant_id, email")
    },
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_user_email_tenant",
            columnNames = {"email", "tenant_id"}
        )
    }
)
public class User {
    // ...
}
```

**Key Points:**
- Optional—defaults to entity class name
- `@Index` for database indexes
- `@UniqueConstraint` for composite unique keys

**Used in:** All entity files

---

### @Column

**Package:** `jakarta.persistence`

**Purpose:** Specifies the mapping for a database column.

```java
@Entity
public class User {
    
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Column(name = "is_active", nullable = false)
    private boolean active = true;
    
    @Column(name = "balance", precision = 19, scale = 4)
    private BigDecimal balance;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}
```

**Attributes:**
| Attribute | Description | Default |
|-----------|-------------|---------|
| `name` | Column name | Field name |
| `nullable` | Allow NULL | `true` |
| `unique` | Unique constraint | `false` |
| `length` | String length | 255 |
| `precision` | Decimal digits | 0 |
| `scale` | Decimal places | 0 |
| `insertable` | Include in INSERT | `true` |
| `updatable` | Include in UPDATE | `true` |
| `columnDefinition` | Raw SQL type | — |

**Used in:** All entity files

---

### @Id

**Package:** `jakarta.persistence`

**Purpose:** Marks a field as the primary key of the entity.

```java
@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
}

@Entity
public class LegacyUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;
}
```

**Generation Strategies:**
| Strategy | Description |
|----------|-------------|
| `AUTO` | Provider chooses strategy |
| `IDENTITY` | Database auto-increment |
| `SEQUENCE` | Database sequence |
| `TABLE` | Separate ID table |
| `UUID` | UUID generation |

**Used in:** All entity files

---

### @UuidGenerator

**Package:** `org.hibernate.annotations`

**Purpose:** Hibernate-specific annotation for UUID generation strategies.

```java
@Entity
public class User {
    
    @Id
    @UuidGenerator
    private UUID id;
}

@Entity
public class Order {
    
    @Id
    @UuidGenerator(style = UuidGenerator.Style.TIME)  // Time-based UUID
    private UUID id;
}
```

**Styles:**
- `RANDOM` (default): Random UUID (UUID v4)
- `TIME`: Time-based UUID (UUID v1/v7)
- `AUTO`: Provider decides

**Used in:** All entity files

---

### @Index

**Package:** `jakarta.persistence`

**Purpose:** Defines a database index on one or more columns.

```java
@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_status_tenant", columnList = "status, tenant_id"),
        @Index(name = "idx_user_created", columnList = "created_at DESC")
    }
)
public class User {
    // ...
}
```

**Key Points:**
- `columnList` can include multiple columns (composite index)
- Order matters for composite indexes
- Can specify sort order: `ASC`, `DESC`
- `unique = true` for unique index

**Used in:** All entity files

---

### @ManyToOne

**Package:** `jakarta.persistence`

**Purpose:** Defines a many-to-one relationship between entities.

```java
@Entity
public class User {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;
}

@Entity
public class Order {
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
```

**Key Points:**
- Default fetch: `EAGER` (always loads)—change to `LAZY`!
- `optional = false` for NOT NULL constraint
- Entity on the "many" side owns the relationship

**Used in:** [Location.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Location.java), [RefreshToken.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/RefreshToken.java), [User.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/User.java)

---

### @OneToMany

**Package:** `jakarta.persistence`

**Purpose:** Defines a one-to-many relationship between entities.

```java
@Entity
public class Tenant {
    
    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users = new ArrayList<>();
    
    // Helper methods for bidirectional relationship
    public void addUser(User user) {
        users.add(user);
        user.setTenant(this);
    }
    
    public void removeUser(User user) {
        users.remove(user);
        user.setTenant(null);
    }
}
```

**Key Points:**
- `mappedBy` = field name in the owning (many) side
- Default fetch: `LAZY`
- `cascade` specifies operations to cascade
- `orphanRemoval = true` deletes children when removed from collection

**Cascade Types:**
| Type | Description |
|------|-------------|
| `ALL` | All operations |
| `PERSIST` | Save parent → save children |
| `MERGE` | Update parent → update children |
| `REMOVE` | Delete parent → delete children |
| `REFRESH` | Refresh parent → refresh children |
| `DETACH` | Detach parent → detach children |

**Used in:** [Tenant.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Tenant.java)

---

### @ManyToMany

**Package:** `jakarta.persistence`

**Purpose:** Defines a many-to-many relationship between entities.

```java
@Entity
public class User {
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}

@Entity
public class Role {
    
    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
}
```

**Key Points:**
- One side owns the relationship (has `@JoinTable`)
- Other side uses `mappedBy`
- Creates a join table in the database
- Use `Set` to avoid duplicates

**Used in:** [Role.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Role.java), [User.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/User.java)

---

### @JoinColumn

**Package:** `jakarta.persistence`

**Purpose:** Specifies the foreign key column for a relationship.

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(
    name = "tenant_id",              // FK column name
    referencedColumnName = "id",     // PK column in referenced table
    nullable = false,                // NOT NULL constraint
    foreignKey = @ForeignKey(name = "fk_user_tenant")  // FK constraint name
)
private Tenant tenant;
```

**Used in:** Entity files with relationships

---

### @JoinTable

**Package:** `jakarta.persistence`

**Purpose:** Specifies the join table for a many-to-many relationship.

```java
@ManyToMany
@JoinTable(
    name = "user_roles",                                    // Join table name
    joinColumns = @JoinColumn(name = "user_id"),           // FK to this entity
    inverseJoinColumns = @JoinColumn(name = "role_id"),    // FK to other entity
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"user_id", "role_id"}
    )
)
private Set<Role> roles;
```

**Used in:** [Role.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Role.java), [User.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/User.java)

---

### @UniqueConstraint

**Package:** `jakarta.persistence`

**Purpose:** Defines a unique constraint on multiple columns.

```java
@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_user_email_tenant",
            columnNames = {"email", "tenant_id"}
        )
    }
)
public class User {
    // email + tenant_id must be unique together
}
```

**Key Points:**
- For single column: use `@Column(unique = true)`
- For multiple columns: use `@UniqueConstraint`
- `name` specifies the constraint name in database

**Used in:** [Role.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Role.java), [User.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/User.java)

---

### @Enumerated

**Package:** `jakarta.persistence`

**Purpose:** Specifies how to persist an enum in the database.

```java
public enum UserStatus {
    ACTIVE, INACTIVE, SUSPENDED, DELETED
}

@Entity
public class User {
    
    @Enumerated(EnumType.STRING)  // Stores "ACTIVE", "INACTIVE", etc.
    @Column(name = "status", nullable = false)
    private UserStatus status;
    
    @Enumerated(EnumType.ORDINAL)  // Stores 0, 1, 2, 3 (NOT recommended!)
    private UserStatus statusOrdinal;
}
```

**Key Points:**
- **Always use `EnumType.STRING`**—ordinal breaks if enum order changes
- `STRING`: More readable, larger storage
- `ORDINAL`: Smaller storage, but fragile

**Used in:** [Location.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Location.java), [Tenant.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Tenant.java), [User.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/User.java)

---

### @MappedSuperclass

**Package:** `jakarta.persistence`

**Purpose:** Designates a class whose mapping is applied to entities that inherit from it. The superclass itself is not an entity.

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    
    @Id
    @UuidGenerator
    private UUID id;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Version
    private Long version;
}

@Entity
@Table(name = "users")
public class User extends BaseEntity {
    // Inherits id, createdAt, updatedAt, version
    
    private String email;
}
```

**Key Points:**
- No table for the superclass
- Fields are inherited by subclasses
- Common use: audit fields, ID generation

**Used in:** [BaseEntity.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/BaseEntity.java)

---

### @EntityListeners

**Package:** `jakarta.persistence`

**Purpose:** Specifies callback listener classes for entity lifecycle events.

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

**Common Listeners:**
- `AuditingEntityListener.class` - Spring Data JPA auditing
- Custom listeners for logging, validation, etc.

**Used in:** [BaseEntity.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/BaseEntity.java)

---

### @Version

**Package:** `jakarta.persistence`

**Purpose:** Enables optimistic locking. The version field is automatically incremented on each update.

```java
@MappedSuperclass
public abstract class BaseEntity {
    
    @Version
    private Long version;
}

// Usage:
// User version=1 is loaded by two transactions
// Transaction A updates → version becomes 2
// Transaction B tries to update version=1 → OptimisticLockException!
```

**Key Points:**
- Prevents lost updates in concurrent modifications
- Throws `OptimisticLockException` on version mismatch
- Supported types: `Integer`, `Long`, `Short`, `Timestamp`

**Used in:** [BaseEntity.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/BaseEntity.java)

---

### @JdbcTypeCode

**Package:** `org.hibernate.annotations`

**Purpose:** Hibernate-specific annotation to specify the JDBC type for a column.

```java
@Entity
public class Tenant {
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> settings;
}
```

**Common Types:**
- `SqlTypes.JSON` - JSON/JSONB columns
- `SqlTypes.ARRAY` - Array columns
- `SqlTypes.UUID` - UUID columns

**Used in:** [Tenant.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/Tenant.java)

---

## 6. JPA Auditing

These annotations work with `@EnableJpaAuditing` and `@EntityListeners(AuditingEntityListener.class)`.

### @CreatedDate

**Package:** `org.springframework.data.annotation`

**Purpose:** Automatically populates the field with the creation timestamp.

```java
@CreatedDate
@Column(name = "created_at", nullable = false, updatable = false)
private LocalDateTime createdAt;
```

---

### @CreatedBy

**Package:** `org.springframework.data.annotation`

**Purpose:** Automatically populates the field with the creator's identity.

```java
@CreatedBy
@Column(name = "created_by", updatable = false)
private String createdBy;
```

Requires an `AuditorAware<T>` bean:

```java
@Bean
public AuditorAware<String> auditorProvider() {
    return () -> Optional.ofNullable(SecurityContextHolder.getContext())
        .map(SecurityContext::getAuthentication)
        .filter(Authentication::isAuthenticated)
        .map(Authentication::getName);
}
```

---

### @LastModifiedDate

**Package:** `org.springframework.data.annotation`

**Purpose:** Automatically updates the field with the last modification timestamp.

```java
@LastModifiedDate
@Column(name = "updated_at")
private LocalDateTime updatedAt;
```

---

### @LastModifiedBy

**Package:** `org.springframework.data.annotation`

**Purpose:** Automatically updates the field with the last modifier's identity.

```java
@LastModifiedBy
@Column(name = "updated_by")
private String updatedBy;
```

**Used in:** [BaseEntity.java](../../src/backend/src/main/java/com/retailmanagement/infrastructure/persistence/entity/BaseEntity.java)

---

## 7. Lombok

Lombok annotations generate boilerplate code at compile time. Include Lombok as a dependency and enable annotation processing in your IDE.

### @Data

**Purpose:** A shortcut that combines `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, and `@RequiredArgsConstructor`.

```java
@Data
public class UserDto {
    private String email;
    private String firstName;
    private String lastName;
}

// Generates:
// - Getters for all fields
// - Setters for all non-final fields
// - toString()
// - equals() and hashCode()
// - Constructor for final/required fields
```

**⚠️ Warning:** Don't use `@Data` on JPA entities—generates problematic `equals`/`hashCode`.

**Used in:** DTO classes, [UserPrincipal.java](../../src/backend/src/main/java/com/retailmanagement/common/security/UserPrincipal.java)

---

### @Builder

**Purpose:** Implements the Builder pattern for object creation.

```java
@Builder
public class UserResponse {
    private UUID id;
    private String email;
    private String fullName;
}

// Usage:
UserResponse response = UserResponse.builder()
    .id(user.getId())
    .email(user.getEmail())
    .fullName(user.getFirstName() + " " + user.getLastName())
    .build();
```

**Key Points:**
- Creates a static `builder()` method
- Creates an inner `Builder` class
- Use `@Builder.Default` for default values
- Use `@Singular` for collection builder methods

**Used in:** All entities, DTOs, [ApiResponse.java](../../src/backend/src/main/java/com/retailmanagement/common/dto/response/ApiResponse.java)

---

### @Getter / @Setter

**Purpose:** Generates getter and/or setter methods for fields.

```java
@Getter
@Setter
public class User {
    private String email;      // Generates getEmail() and setEmail()
    
    @Getter(AccessLevel.NONE)  // No getter
    private String password;
    
    @Setter(AccessLevel.PROTECTED)  // Protected setter
    private UUID tenantId;
}

// Can also be used on individual fields:
public class Example {
    @Getter @Setter
    private String name;
}
```

**Used in:** Entities, [JwtProperties.java](../../src/backend/src/main/java/com/retailmanagement/common/security/JwtProperties.java)

---

### @NoArgsConstructor

**Purpose:** Generates a no-argument constructor.

```java
@NoArgsConstructor
public class User {
    private String email;
}

// Generates:
// public User() { }

// Options:
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // JPA entities
@NoArgsConstructor(force = true)  // Initialize final fields to 0/null/false
```

**Key Points:**
- Required for JPA entities
- Use `access = AccessLevel.PROTECTED` for entities (JPA requirement)

**Used in:** All entities, DTOs

---

### @AllArgsConstructor

**Purpose:** Generates a constructor with all fields as parameters.

```java
@AllArgsConstructor
public class UserDto {
    private String email;
    private String firstName;
    private String lastName;
}

// Generates:
// public UserDto(String email, String firstName, String lastName) {
//     this.email = email;
//     this.firstName = firstName;
//     this.lastName = lastName;
// }
```

**Used in:** All entities, DTOs

---

### @RequiredArgsConstructor

**Purpose:** Generates a constructor for `final` fields and fields marked with `@NonNull`.

```java
@Service
@RequiredArgsConstructor
public class AuthServiceImpl {
    
    private final UserRepository userRepository;  // Included in constructor
    private final PasswordEncoder passwordEncoder;  // Included
    
    private String tempValue;  // NOT included (not final)
}

// Generates:
// public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//     this.userRepository = userRepository;
//     this.passwordEncoder = passwordEncoder;
// }
```

**Key Points:**
- Preferred way for dependency injection (constructor injection)
- Only includes `final` fields and `@NonNull` fields
- Cleaner than `@Autowired` on each field

**Used in:** [SecurityConfig.java](../../src/backend/src/main/java/com/retailmanagement/common/config/SecurityConfig.java), [AuthServiceImpl.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/service/impl/AuthServiceImpl.java), controllers, services

---

### @Slf4j

**Purpose:** Creates a `private static final Logger log` field using SLF4J.

```java
@Slf4j
@Service
public class AuthServiceImpl {
    
    public void login(String email) {
        log.debug("Login attempt for: {}", email);
        log.info("User logged in: {}", email);
        log.warn("Multiple login attempts for: {}", email);
        log.error("Login failed for: {}", email);
    }
}

// Generates:
// private static final org.slf4j.Logger log = 
//     org.slf4j.LoggerFactory.getLogger(AuthServiceImpl.class);
```

**Related:**
- `@Log` - java.util.logging
- `@Log4j2` - Apache Log4j 2
- `@CommonsLog` - Apache Commons Logging

**Used in:** [GlobalExceptionHandler.java](../../src/backend/src/main/java/com/retailmanagement/common/exception/GlobalExceptionHandler.java), [JwtAuthenticationFilter.java](../../src/backend/src/main/java/com/retailmanagement/common/security/JwtAuthenticationFilter.java), [AuthServiceImpl.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/service/impl/AuthServiceImpl.java)

---

## 8. Bean Validation (jakarta.validation)

Bean Validation annotations validate data at the controller or service level.

### @Valid

**Package:** `jakarta.validation`

**Purpose:** Triggers validation on the annotated parameter. Must be used with validation constraints.

```java
@PostMapping("/signup")
public ResponseEntity<ApiResponse<AuthResponse>> signUp(
        @Valid @RequestBody SignUpRequest request) {
    // Request is validated before method execution
    // If validation fails, MethodArgumentNotValidException is thrown
    return ResponseEntity.ok(authService.signUp(request));
}
```

**Key Points:**
- Triggers validation constraints on the object
- Throws `MethodArgumentNotValidException` on failure
- Handle with `@ExceptionHandler` or `@ControllerAdvice`

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

### @NotBlank

**Package:** `jakarta.validation.constraints`

**Purpose:** Validates that a string is not null, not empty, and not just whitespace.

```java
public class SignUpRequest {
    
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}
```

**Comparison:**
| Annotation | Null | Empty `""` | Whitespace `"  "` |
|------------|------|------------|-------------------|
| `@NotNull` | ❌ | ✅ | ✅ |
| `@NotEmpty` | ❌ | ❌ | ✅ |
| `@NotBlank` | ❌ | ❌ | ❌ |

**Used in:** [RefreshTokenRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/RefreshTokenRequest.java), [SignInRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/SignInRequest.java), [SignUpRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/SignUpRequest.java)

---

### @Size

**Package:** `jakarta.validation.constraints`

**Purpose:** Validates that a string, collection, map, or array size is within bounds.

```java
public class SignUpRequest {
    
    @Size(min = 2, max = 50, message = "First name must be 2-50 characters")
    private String firstName;
    
    @Size(min = 8, max = 100, message = "Password must be 8-100 characters")
    private String password;
    
    @Size(max = 5, message = "Maximum 5 roles allowed")
    private Set<String> roles;
}
```

**Used in:** [SignInRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/SignInRequest.java), [SignUpRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/SignUpRequest.java)

---

### @Email

**Package:** `jakarta.validation.constraints`

**Purpose:** Validates that a string is a valid email address format.

```java
public class SignUpRequest {
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
}
```

**Key Points:**
- Validates format, not existence
- Allows empty string by default (combine with `@NotBlank`)
- Use `regexp` for custom email pattern

**Used in:** [SignInRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/SignInRequest.java), [SignUpRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/SignUpRequest.java)

---

### @Pattern

**Package:** `jakarta.validation.constraints`

**Purpose:** Validates that a string matches a regular expression.

```java
public class SignUpRequest {
    
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        message = "Password must contain uppercase, lowercase, digit, and special character"
    )
    private String password;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phoneNumber;
}
```

**Used in:** [SignUpRequest.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/request/SignUpRequest.java)

---

## 9. OpenAPI/Swagger (springdoc)

These annotations document your API for automatic OpenAPI/Swagger generation.

### @Tag

**Package:** `io.swagger.v3.oas.annotations.tags`

**Purpose:** Groups operations together in the API documentation.

```java
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {
    // All endpoints in this controller are grouped under "Authentication"
}
```

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

### @Operation

**Package:** `io.swagger.v3.oas.annotations`

**Purpose:** Describes an API operation (endpoint).

```java
@PostMapping("/signup")
@Operation(
    summary = "Register a new user",
    description = "Creates a new user account with the provided information",
    responses = {
        @ApiResponse(responseCode = "201", description = "User created successfully"),
        @ApiResponse(responseCode = "400", description = "Validation error"),
        @ApiResponse(responseCode = "409", description = "Email already exists")
    }
)
public ResponseEntity<ApiResponse<AuthResponse>> signUp(
        @Valid @RequestBody SignUpRequest request) {
    // ...
}
```

**Used in:** [AuthController.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/controller/AuthController.java)

---

## 10. Jackson (JSON Serialization)

### @JsonInclude

**Package:** `com.fasterxml.jackson.annotation`

**Purpose:** Controls which properties are included in JSON serialization.

```java
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)  // Exclude null fields
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;       // Excluded if null
    private Object errors; // Excluded if null
}

// JSON output when data is null:
// { "success": true, "message": "OK" }
// NOT: { "success": true, "message": "OK", "data": null, "errors": null }
```

**Include Options:**
| Option | Description |
|--------|-------------|
| `ALWAYS` | Include all properties (default) |
| `NON_NULL` | Exclude null values |
| `NON_EMPTY` | Exclude null, empty strings, empty collections |
| `NON_DEFAULT` | Exclude default values (0, false, null) |

**Used in:** [ApiResponse.java](../../src/backend/src/main/java/com/retailmanagement/common/dto/response/ApiResponse.java), [AuthResponse.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/response/AuthResponse.java), [UserResponse.java](../../src/backend/src/main/java/com/retailmanagement/module/auth/dto/response/UserResponse.java)

---

## 11. Java Standard

### @Override

**Package:** `java.lang`

**Purpose:** Indicates that a method is intended to override a method in a superclass or implement an interface method.

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Override
    public UserDetails loadUserByUsername(String username) {
        // Compiler verifies this actually overrides the interface method
        return userRepository.findByEmail(username)
            .map(this::toUserPrincipal)
            .orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
```

**Key Points:**
- Compile-time check that method actually overrides
- Prevents bugs from typos in method signatures
- Best practice: always use when overriding

**Used in:** Service implementations, [UserPrincipal.java](../../src/backend/src/main/java/com/retailmanagement/common/security/UserPrincipal.java), filters

---

### @SuppressWarnings

**Package:** `java.lang`

**Purpose:** Instructs the compiler to suppress specific warnings.

```java
@SuppressWarnings("unchecked")
public <T> T getValue() {
    return (T) someObject;  // Unchecked cast, but we know it's safe
}

@SuppressWarnings({"unused", "deprecation"})
public void legacyMethod() {
    // ...
}
```

**Common Values:**
| Value | Description |
|-------|-------------|
| `"unchecked"` | Unchecked generic operations |
| `"deprecation"` | Use of deprecated APIs |
| `"unused"` | Unused code |
| `"rawtypes"` | Raw type usage |
| `"all"` | All warnings (not recommended) |

**Used in:** [JwtTokenProvider.java](../../src/backend/src/main/java/com/retailmanagement/common/security/JwtTokenProvider.java)

---

## Quick Reference Table

| Category | Annotation | Purpose |
|----------|------------|---------|
| **Spring Core** | `@SpringBootApplication` | Main entry point |
| | `@Configuration` | Configuration class |
| | `@Bean` | Define a bean |
| | `@Component` | Generic component |
| | `@Service` | Business logic |
| | `@Repository` | Data access |
| **Spring Web** | `@RestController` | REST controller |
| | `@RequestMapping` | URL mapping |
| | `@PostMapping` | HTTP POST |
| | `@RequestBody` | Deserialize request body |
| | `@ExceptionHandler` | Handle exceptions |
| **Spring Security** | `@EnableWebSecurity` | Enable security |
| | `@PreAuthorize` | Method authorization |
| **JPA** | `@Entity` | Database entity |
| | `@Table` | Table configuration |
| | `@Column` | Column configuration |
| | `@ManyToOne` | Many-to-one relationship |
| | `@Transactional` | Transaction scope |
| **Lombok** | `@Data` | Getters, setters, etc. |
| | `@Builder` | Builder pattern |
| | `@RequiredArgsConstructor` | Constructor injection |
| | `@Slf4j` | Logger field |
| **Validation** | `@Valid` | Trigger validation |
| | `@NotBlank` | Not null/empty/whitespace |
| | `@Size` | Size constraints |
| | `@Email` | Email format |

---

## Best Practices

1. **Use `@RequiredArgsConstructor` for DI** - Cleaner than field injection with `@Autowired`

2. **Always use `@Transactional(readOnly = true)`** for read methods - Optimizes performance

3. **Prefer `@NotBlank` over `@NotNull`** for strings - Catches empty strings

4. **Use `FetchType.LAZY`** for relationships - Avoids N+1 queries

5. **Always use `EnumType.STRING`** with `@Enumerated` - Prevents bugs when reordering enums

6. **Don't use `@Data` on entities** - Use `@Getter`, `@Setter`, `@Builder` separately

7. **Use `@Slf4j`** instead of creating loggers manually - Cleaner code

8. **Document APIs with `@Operation`** - Auto-generates Swagger docs

9. **Use `@PreAuthorize`** for method security - More flexible than URL-based security

10. **Extend `BaseEntity`** for common fields - DRY principle for audit fields
