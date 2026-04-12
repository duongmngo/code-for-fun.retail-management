# How Configuration Properties Are Loaded - Complete Guide

## 🎯 Overview

Spring Boot has a **standard mechanism** to load YAML/properties into Java objects. There **are specific naming conventions** you must follow!

---

## 📋 The Standard Format/Syntax

### ✅ YES - This is a Spring Boot Standard!

Your `application.yml` follows **Spring Boot's official property binding conventions**:

```yaml
app:                              # Prefix
  jwt:                            # Sub-prefix
    secret: value                 # Property (kebab-case or camelCase)
    access-token-expiration-ms: 900000   # kebab-case → camelCase in Java
    refresh-token-expiration-ms: 604800000
```

Maps to Java class:

```java
@ConfigurationProperties(prefix = "app.jwt")  // Matches "app.jwt" in YAML
public class JwtProperties {
    private String secret;                     // Maps to: secret
    private long accessTokenExpirationMs;      // Maps to: access-token-expiration-ms
    private long refreshTokenExpirationMs;     // Maps to: refresh-token-expiration-ms
}
```

---

## 🔄 How Properties Are Loaded (Step-by-Step)

### Your Current Example: JWT Configuration

#### Step 1: YAML Configuration
```yaml
# In application.yml
app:
  jwt:
    secret: ${JWT_SECRET:mySecretKey...}
    access-token-expiration-ms: 900000
    refresh-token-expiration-ms: 604800000
```

#### Step 2: Java Properties Class
```java
// File: JwtProperties.java
@Component                                    // ← Makes it a Spring bean
@ConfigurationProperties(prefix = "app.jwt")  // ← Binds to "app.jwt" section
@Getter                                       // ← Lombok: generates getters
@Setter                                       // ← Lombok: generates setters
public class JwtProperties {
    private String secret;
    private long accessTokenExpirationMs;
    private long refreshTokenExpirationMs;
}
```

#### Step 3: Spring Boot Magic ✨

When the application starts:

```
1. Spring Boot reads application.yml
   ↓
2. Finds "app.jwt" section
   ↓
3. Looks for @ConfigurationProperties(prefix = "app.jwt")
   ↓
4. Creates JwtProperties bean
   ↓
5. Binds YAML values to Java fields:
   - access-token-expiration-ms → accessTokenExpirationMs
   - refresh-token-expiration-ms → refreshTokenExpirationMs
   ↓
6. Bean is ready to inject anywhere!
```

#### Step 4: Use in Your Code
```java
@Service
public class JwtService {
    
    private final JwtProperties jwtProperties;  // ← Inject the properties
    
    // Constructor injection (recommended)
    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }
    
    public String generateToken(User user) {
        // Use the properties!
        long expiration = jwtProperties.getAccessTokenExpirationMs();
        String secret = jwtProperties.getSecret();
        
        return Jwts.builder()
            .setSubject(user.getEmail())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
    }
}
```

---

## 📐 Naming Convention Rules (CRITICAL!)

### Rule 1: Kebab-case in YAML → camelCase in Java

| YAML (application.yml) | Java Field Name | ✅/❌ |
|------------------------|-----------------|-------|
| `access-token-expiration-ms` | `accessTokenExpirationMs` | ✅ Works |
| `access_token_expiration_ms` | `accessTokenExpirationMs` | ✅ Works |
| `accessTokenExpirationMs` | `accessTokenExpirationMs` | ✅ Works |
| `ACCESS-TOKEN-EXPIRATION-MS` | `accessTokenExpirationMs` | ✅ Works (case-insensitive) |
| `access.token.expiration.ms` | `accessTokenExpirationMs` | ❌ Creates nested structure! |

**Recommended:** Use **kebab-case** in YAML, **camelCase** in Java

```yaml
# ✅ GOOD - Kebab-case (recommended for YAML)
app:
  jwt:
    access-token-expiration-ms: 900000
    refresh-token-expiration-ms: 604800000
```

```java
// ✅ GOOD - camelCase (Java convention)
private long accessTokenExpirationMs;
private long refreshTokenExpirationMs;
```

### Rule 2: Dots Create Nesting

```yaml
# This creates nested structure!
app:
  jwt.secret: value              # ❌ DON'T DO THIS
  jwt.expiration.time: 900000    # ❌ Creates multiple levels

# This is correct!
app:
  jwt:                           # ✅ DO THIS
    secret: value
    expiration-time: 900000
```

### Rule 3: Type Matching

| YAML Value | Java Type | Example |
|------------|-----------|---------|
| `900000` | `long`, `int`, `Long`, `Integer` | `private long expirationMs;` |
| `true` | `boolean`, `Boolean` | `private boolean enabled;` |
| `"hello"` | `String` | `private String message;` |
| `http://localhost:3000,http://localhost:3001` | `String[]`, `List<String>` | `private List<String> allowedOrigins;` |

---

## 🎨 Different Ways to Load Configuration

### Method 1: @ConfigurationProperties (BEST - What You're Using!)

**Advantages:** ✅ Type-safe, ✅ Grouped, ✅ Easy to validate

```yaml
# application.yml
app:
  jwt:
    secret: mySecret
    access-token-expiration-ms: 900000
```

```java
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Validated  // Optional: enables validation
@Getter
@Setter
public class JwtProperties {
    @NotBlank  // Validation: must not be blank
    private String secret;
    
    @Min(1000)  // Validation: must be at least 1000ms
    private long accessTokenExpirationMs;
    
    private long refreshTokenExpirationMs;
}

// Usage
@Service
public class MyService {
    private final JwtProperties jwtProperties;
    
    public MyService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }
    
    public void doSomething() {
        String secret = jwtProperties.getSecret();  // Type-safe!
    }
}
```

### Method 2: @Value (Simpler, Less Organized)

**Advantages:** Quick for single values
**Disadvantages:** ❌ Scattered across code, ❌ String-based, ❌ No grouping

```java
@Service
public class JwtService {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.access-token-expiration-ms}")
    private long accessTokenExpiration;
    
    // Use directly
    public void doSomething() {
        String secret = this.jwtSecret;
    }
}
```

### Method 3: Environment (Programmatic)

**Advantages:** Dynamic access
**Disadvantages:** ❌ Not type-safe, ❌ String-based

```java
@Service
public class MyService {
    
    @Autowired
    private Environment env;
    
    public void doSomething() {
        String secret = env.getProperty("app.jwt.secret");
        Long expiration = env.getProperty("app.jwt.access-token-expiration-ms", Long.class);
    }
}
```

---

## 🔍 Your Current Configuration Mapped

Let me show you how ALL your configuration can be loaded:

### 1. JWT Configuration (Already Done! ✅)

```yaml
app:
  jwt:
    secret: ${JWT_SECRET:...}
    access-token-expiration-ms: 900000
    refresh-token-expiration-ms: 604800000
```

```java
// ✅ You already have this!
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret;
    private long accessTokenExpirationMs;
    private long refreshTokenExpirationMs;
}
```

### 2. CORS Configuration (You Should Create This!)

```yaml
app:
  cors:
    allowed-origins: http://localhost:3000,http://localhost:3001
    allowed-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
    allowed-headers: "*"
    allow-credentials: true
```

```java
// Create this file!
@Component
@ConfigurationProperties(prefix = "app.cors")
@Getter
@Setter
public class CorsProperties {
    private List<String> allowedOrigins;
    private List<String> allowedMethods;
    private String allowedHeaders;
    private boolean allowCredentials;
}
```

### 3. Server Configuration (Spring Boot Built-in)

```yaml
server:
  port: ${SERVER_PORT:8080}
  servlet:
    context-path: /api
```

```java
// Spring Boot provides this automatically!
@Autowired
private ServerProperties serverProperties;  // Built-in class

// Or use @Value
@Value("${server.port}")
private int serverPort;
```

---

## 🎯 Complete Example: Create CORS Properties

Let me show you how to create a properties class for CORS:

### Step 1: Create CorsProperties.java

```java
package com.retailmanagement.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.cors")
@Getter
@Setter
public class CorsProperties {
    private List<String> allowedOrigins;
    private List<String> allowedMethods;
    private String allowedHeaders;
    private boolean allowCredentials;
}
```

### Step 2: Use in WebConfig

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    private final CorsProperties corsProperties;
    
    // Inject the properties
    public WebConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(corsProperties.getAllowedOrigins().toArray(new String[0]))
            .allowedMethods(corsProperties.getAllowedMethods().toArray(new String[0]))
            .allowedHeaders(corsProperties.getAllowedHeaders())
            .allowCredentials(corsProperties.isAllowCredentials());
    }
}
```

---

## 📚 Standard Annotation Reference

### Core Annotations

```java
@ConfigurationProperties(prefix = "app.jwt")
// - Binds properties from YAML/properties file
// - prefix: the path in YAML to bind from

@Component  // or @Configuration
// - Makes the class a Spring bean
// - Required for @ConfigurationProperties to work

@Validated
// - Enables JSR-303 validation
// - Use with @NotNull, @NotBlank, @Min, @Max, etc.

@EnableConfigurationProperties(JwtProperties.class)
// - Alternative to @Component
// - Use in @Configuration class to enable specific properties
```

### Validation Annotations (Optional)

```java
import javax.validation.constraints.*;

@NotNull         // Value must not be null
@NotBlank        // String must not be empty
@NotEmpty        // Collection must not be empty
@Min(1000)       // Number must be >= 1000
@Max(10000)      // Number must be <= 10000
@Pattern(regexp) // String must match regex
@Size(min, max)  // Collection/String size constraints
@Email           // Must be valid email format
```

### Example with Validation

```java
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Validated
@Getter
@Setter
public class JwtProperties {
    
    @NotBlank(message = "JWT secret must not be blank")
    @Size(min = 32, message = "JWT secret must be at least 32 characters")
    private String secret;
    
    @Min(value = 60000, message = "Access token expiration must be at least 1 minute")
    @Max(value = 86400000, message = "Access token expiration must not exceed 24 hours")
    private long accessTokenExpirationMs;
    
    @Min(value = 3600000, message = "Refresh token expiration must be at least 1 hour")
    private long refreshTokenExpirationMs;
}
```

---

## 🔧 Advanced Features

### 1. Nested Properties

```yaml
app:
  security:
    jwt:
      access-token:
        expiration-ms: 900000
        header-name: Authorization
      refresh-token:
        expiration-ms: 604800000
```

```java
@ConfigurationProperties(prefix = "app.security.jwt")
@Getter
@Setter
public class JwtProperties {
    private AccessToken accessToken;
    private RefreshToken refreshToken;
    
    @Getter
    @Setter
    public static class AccessToken {
        private long expirationMs;
        private String headerName;
    }
    
    @Getter
    @Setter
    public static class RefreshToken {
        private long expirationMs;
    }
}

// Usage
jwtProperties.getAccessToken().getExpirationMs();
```

### 2. List/Array Properties

```yaml
app:
  cors:
    allowed-origins:
      - http://localhost:3000
      - http://localhost:3001
      - https://myapp.com
```

```java
@ConfigurationProperties(prefix = "app.cors")
@Getter
@Setter
public class CorsProperties {
    private List<String> allowedOrigins;  // Spring auto-converts!
}
```

### 3. Map Properties

```yaml
app:
  features:
    user-registration: true
    email-verification: false
    two-factor-auth: true
```

```java
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private Map<String, Boolean> features;
}

// Usage
if (appProperties.getFeatures().get("user-registration")) {
    // Enable user registration
}
```

### 4. Duration Properties

```yaml
app:
  cache:
    ttl: 30m  # 30 minutes
    # Supports: ns, us, ms, s, m, h, d
```

```java
import java.time.Duration;

@ConfigurationProperties(prefix = "app.cache")
@Getter
@Setter
public class CacheProperties {
    private Duration ttl;  // Spring auto-converts "30m" to Duration!
}

// Usage
long seconds = cacheProperties.getTtl().getSeconds();
```

### 5. DataSize Properties

```yaml
app:
  upload:
    max-file-size: 10MB
    # Supports: B, KB, MB, GB, TB
```

```java
import org.springframework.util.unit.DataSize;

@ConfigurationProperties(prefix = "app.upload")
@Getter
@Setter
public class UploadProperties {
    private DataSize maxFileSize;
}

// Usage
long bytes = uploadProperties.getMaxFileSize().toBytes();
```

---

## ✅ Best Practices Summary

### DO ✅

1. **Use @ConfigurationProperties for grouped configs**
   ```java
   @ConfigurationProperties(prefix = "app.jwt")
   ```

2. **Use kebab-case in YAML**
   ```yaml
   access-token-expiration-ms: 900000
   ```

3. **Use camelCase in Java**
   ```java
   private long accessTokenExpirationMs;
   ```

4. **Add validation**
   ```java
   @Validated
   @NotBlank
   @Min(1000)
   ```

5. **Group related properties**
   ```yaml
   app:
     jwt:
       # All JWT configs together
   ```

### DON'T ❌

1. **Don't use dots for property names**
   ```yaml
   # ❌ BAD
   app.jwt.secret: value
   
   # ✅ GOOD
   app:
     jwt:
       secret: value
   ```

2. **Don't scatter @Value everywhere**
   ```java
   // ❌ BAD - hard to maintain
   @Value("${app.jwt.secret}")
   @Value("${app.jwt.expiration}")
   
   // ✅ GOOD - use @ConfigurationProperties
   ```

3. **Don't hardcode values**
   ```yaml
   # ❌ BAD
   secret: hardcodedSecret123
   
   # ✅ GOOD - use environment variables
   secret: ${JWT_SECRET:defaultForLocalOnly}
   ```

---

## 🎯 Summary

**Question:** Is it a standard format/syntax?

**Answer:** ✅ **YES!** This is Spring Boot's official standard:

1. **Property Binding:**
   - YAML → Java object automatic mapping
   - Follows strict naming conventions

2. **Naming Convention:**
   - YAML: `kebab-case` or `snake_case`
   - Java: `camelCase`
   - Spring converts automatically!

3. **How it works:**
   ```
   application.yml → @ConfigurationProperties → Java Bean → Inject anywhere
   ```

4. **Your current setup:**
   - ✅ Using `@ConfigurationProperties` for JWT
   - ✅ Following kebab-case in YAML
   - ✅ Using camelCase in Java
   - ✅ Environment variable support

**You're doing it correctly!** 🎉

