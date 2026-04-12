# How application.yml Works - Complete Guide

## 📚 Overview

`application.yml` is Spring Boot's configuration file that controls how your application behaves. Think of it as the **control panel** for your entire application.

---

## 🏗️ Structure of Your application.yml

Your file has **3 sections** separated by `---`:

```
1. Common/Default Configuration (Lines 1-110)
   ↓
   ---
2. Local Profile Configuration (Lines 112-133)
   ↓
   ---
3. Production Profile Configuration (Lines 135-157)
```

---

## 🎯 How Spring Boot Reads It

### Step 1: Load Common Configuration
Spring Boot **always** loads the first section (before any `---`):

```yaml
spring:
  application:
    name: retail-management-api
    
server:
  port: ${SERVER_PORT:8080}  # This applies to ALL profiles
```

### Step 2: Check Active Profile
Then Spring checks which profile is active:

```yaml
spring:
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:local}  # Default is 'local'
```

**How it works:**
- Looks for environment variable `SPRING_PROFILES_ACTIVE`
- If not found, uses default: `local`
- Possible values: `local`, `dev`, or `prod`

### Step 3: Load Profile-Specific Configuration
Based on the active profile, Spring loads the matching section:

```yaml
---
spring:
  config:
    activate:
      on-profile: local  # ← This section loads ONLY when profile = local
```

---

## 💡 Environment Variables - The Magic `${}` Syntax

### Pattern: `${VARIABLE_NAME:default_value}`

**Example from your config:**

```yaml
server:
  port: ${SERVER_PORT:8080}
```

**How this works:**

1. **First**: Check if environment variable `SERVER_PORT` exists
   ```bash
   export SERVER_PORT=9000
   ```
   Result: App runs on port **9000**

2. **If not found**: Use the default value after `:`
   ```bash
   # SERVER_PORT not set
   ```
   Result: App runs on port **8080**

### 🔍 Real Examples from Your Config

| Configuration | Env Variable | Default | What It Controls |
|--------------|--------------|---------|------------------|
| `port: ${SERVER_PORT:8080}` | `SERVER_PORT` | `8080` | Which port app runs on |
| `url: ${DATABASE_URL:jdbc:postgresql://...}` | `DATABASE_URL` | `jdbc:postgresql://localhost:5432/retail_management` | Database connection |
| `username: ${POSTGRES_USER:postgres}` | `POSTGRES_USER` | `postgres` | Database username |
| `secret: ${JWT_SECRET:...}` | `JWT_SECRET` | (long default) | JWT token signing key |

---

## 🎨 Profiles Explained - Like Different Costumes

Think of profiles as different **configurations for different environments**.

### Your 3 Profiles:

#### 1️⃣ **Local Profile** (for your laptop)
```yaml
---
spring:
  config:
    activate:
      on-profile: local

  jpa:
    show-sql: true  # ← Shows SQL queries (helpful for debugging)
    
logging:
  level:
    com.retailmanagement: DEBUG  # ← Verbose logging
```

**When active:** Development on your machine
**Characteristics:**
- Shows SQL queries
- Debug logging enabled
- Uses local database defaults
- Verbose error messages

#### 2️⃣ **Dev Profile** (for development server)
```yaml
---
spring:
  config:
    activate:
      on-profile: dev

  jpa:
    show-sql: false  # ← Cleaner logs
    
logging:
  level:
    root: INFO
    com.retailmanagement: DEBUG
```

**When active:** Deployed to dev server
**Characteristics:**
- Less verbose than local
- Still has debug logging for your app
- Requires environment variables (no defaults)

#### 3️⃣ **Production Profile** (for live server)
```yaml
---
spring:
  config:
    activate:
      on-profile: prod

  datasource:
    hikari:
      maximum-pool-size: 20  # ← More connections for traffic
      
logging:
  level:
    root: WARN  # ← Only warnings and errors
    com.retailmanagement: INFO
```

**When active:** Live production system
**Characteristics:**
- Minimal logging (performance)
- Larger database connection pool
- More secure settings

---

## 🔄 How Profiles Override Each Other

### Priority Order (Highest to Lowest):

```
Profile-Specific Settings
         ↓
Common/Default Settings
```

### Example: Database Connection

**Common section:**
```yaml
# (Not defined in common section)
```

**Local profile:**
```yaml
datasource:
  url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/retail_management}
  username: ${POSTGRES_USER:postgres}
  password: ${POSTGRES_PASSWORD:postgres123}  # ← Has default
```

**Prod profile:**
```yaml
datasource:
  url: ${DATABASE_URL}  # ← No default! Must set env var
  username: ${POSTGRES_USER}
  password: ${POSTGRES_PASSWORD}
```

**Result:**
- **Local**: Can run without setting env vars (uses defaults)
- **Prod**: **MUST** set env vars or app won't start

---

## 🎬 Real-World Examples

### Example 1: Starting App on Port 3000

**Option A - Environment Variable:**
```bash
export SERVER_PORT=3000
./gradlew bootRun
```

**Option B - Command Line:**
```bash
./gradlew bootRun --args='--server.port=3000'
```

**Option C - Change application.yml:**
```yaml
server:
  port: 3000  # Hardcoded (not recommended)
```

**What happens:**
1. Spring reads `application.yml`
2. Sees: `port: ${SERVER_PORT:8080}`
3. Checks environment: `SERVER_PORT=3000` ✓
4. Uses **3000** instead of default 8080

### Example 2: Switching to Production Profile

```bash
export SPRING_PROFILES_ACTIVE=prod
./gradlew bootRun
```

**What happens:**
1. Spring sees `SPRING_PROFILES_ACTIVE=prod`
2. Loads **common** section first
3. Then loads **prod** section
4. Skips `local` and `dev` sections
5. Logging changes to WARN level
6. Database pool size increases to 20
7. Requires all env vars to be set

### Example 3: Custom Database

**Create .env file:**
```bash
DATABASE_URL=jdbc:postgresql://myserver.com:5432/my_retail_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=super_secret_password
```

**Run:**
```bash
source .env
./gradlew bootRun
```

**What happens:**
1. Env vars override defaults
2. App connects to `myserver.com` instead of `localhost`
3. Uses `admin` user instead of `postgres`

---

## 📋 Configuration Sections Breakdown

### 1. Server Configuration
```yaml
server:
  port: ${SERVER_PORT:8080}
  servlet:
    context-path: /api
```

**Effect:**
- App runs on port 8080 (or custom)
- All URLs start with `/api`
- Example: `http://localhost:8080/api/actuator/health`

### 2. Database Configuration (Local Profile)
```yaml
datasource:
  url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/retail_management}
  hikari:
    maximum-pool-size: 10
    minimum-idle: 5
```

**Effect:**
- Connects to PostgreSQL database
- Maintains 5-10 connections in pool
- Connection timeout: 20 seconds

### 3. JPA/Hibernate Configuration
```yaml
jpa:
  hibernate:
    ddl-auto: validate  # ← Important!
  show-sql: true
```

**ddl-auto options:**
- `validate`: Check schema matches entities (safest)
- `update`: Auto-update schema (risky in prod)
- `create`: Drop and recreate (only for testing!)
- `none`: Do nothing

### 4. Flyway (Database Migrations)
```yaml
flyway:
  enabled: true
  baseline-on-migrate: true
  locations: classpath:db/migration
```

**Effect:**
- Runs SQL migrations from `src/main/resources/db/migration/`
- Keeps database schema versioned
- Runs on startup

### 5. Redis Configuration
```yaml
data:
  redis:
    url: ${REDIS_URL:redis://:redis_password_123@localhost:6379}
```

**Effect:**
- Connects to Redis for caching/sessions
- URL format: `redis://:[password]@[host]:[port]`

### 6. Custom Application Properties
```yaml
app:
  jwt:
    secret: ${JWT_SECRET:...}
    access-token-expiration-ms: 900000  # 15 minutes
```

**Effect:**
- Your custom configuration
- Access in code: `@Value("${app.jwt.secret}")`
- Or use `@ConfigurationProperties`

### 7. CORS Configuration
```yaml
cors:
  allowed-origins: http://localhost:3000,http://localhost:3001
```

**Effect:**
- Frontend apps on these ports can call your API
- Add production URLs for deployment

### 8. Logging Levels
```yaml
logging:
  level:
    root: INFO
    com.retailmanagement: DEBUG
```

**Levels (verbose → quiet):**
- `TRACE`: Everything
- `DEBUG`: Detailed debugging
- `INFO`: General information
- `WARN`: Warnings only
- `ERROR`: Errors only

---

## 🔍 How to Read Your Config in Code

### Method 1: @Value Annotation
```java
@Component
public class MyComponent {
    @Value("${server.port}")
    private int serverPort;
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
}
```

### Method 2: @ConfigurationProperties (Better!)
```java
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret;
    private long accessTokenExpirationMs;
    
    // Getters and setters
}
```

### Method 3: Environment
```java
@Autowired
private Environment env;

public void someMethod() {
    String port = env.getProperty("server.port");
}
```

---

## 🎯 Configuration Priority Order

When Spring Boot finds the same property in multiple places:

```
1. Command line arguments          (Highest)
   --server.port=9000
   
2. System properties
   -Dserver.port=9000
   
3. Environment variables
   export SERVER_PORT=9000
   
4. application-{profile}.yml
   application-prod.yml
   
5. application.yml (profile-specific section)
   spring.config.activate.on-profile: prod
   
6. application.yml (common section)  (Lowest)
   server.port: 8080
```

**Example:**
```bash
# In application.yml: port: 8080
# In environment: SERVER_PORT=9000
# Command line: --server.port=7000

# Result: App runs on port 7000 (command line wins!)
```

---

## 🛠️ Practical Scenarios

### Scenario 1: New Developer Setup

```bash
cd src/backend
cp .env.example .env
# Edit .env if needed
./gradlew bootRun
```

Profile: `local` (default)
Database: localhost with default credentials
Logging: DEBUG (sees everything)

### Scenario 2: Deploy to Staging

```bash
export SPRING_PROFILES_ACTIVE=dev
export DATABASE_URL=jdbc:postgresql://staging-db:5432/retail
export POSTGRES_USER=staging_user
export POSTGRES_PASSWORD=staging_pass
export JWT_SECRET=different_secret_for_staging

./gradlew bootRun
```

Profile: `dev`
Database: Staging server
Logging: Less verbose

### Scenario 3: Production Deployment

```bash
# Usually set in Docker/Kubernetes/Cloud platform
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://prod-db.amazonaws.com:5432/retail
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=super_secure_password_from_vault
JWT_SECRET=production_secret_256_bits
REDIS_URL=redis://prod-redis:6379

java -jar retail-management-api.jar
```

Profile: `prod`
Database: Production RDS
Logging: WARN (minimal)
Pool size: 20 connections

---

## ✅ Best Practices from Your Config

1. ✅ **Environment variables for secrets** - Nothing sensitive hardcoded
2. ✅ **Profile-specific settings** - Different configs for different environments
3. ✅ **Sensible defaults** - Local development works out of the box
4. ✅ **No defaults in prod** - Forces explicit configuration
5. ✅ **Structured comments** - Easy to navigate
6. ✅ **Connection pooling** - HikariCP configured
7. ✅ **Flyway enabled** - Database migrations automated

---

## 🐛 Troubleshooting

### Problem: App won't start - "Could not resolve placeholder"
```
Error: Could not resolve placeholder 'DATABASE_URL' in value "${DATABASE_URL}"
```

**Cause:** Required env var not set (common in prod profile)

**Fix:**
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/retail_management
```

### Problem: Wrong profile active
**Check:**
```bash
# Look for this in startup logs:
The following 1 profile is active: "local"
```

**Change:**
```bash
export SPRING_PROFILES_ACTIVE=dev
```

### Problem: Configuration not taking effect
**Check priority order:** Command line > Env vars > application.yml

**Debug:**
```bash
# Enable all config logging
./gradlew bootRun --debug | grep -i "property"
```

---

## 📚 Summary

**application.yml is like a recipe:**
- **Common section** = Base ingredients (always used)
- **Profile sections** = Variations (use based on occasion)
- **Environment variables** = Custom adjustments (override defaults)

**Your setup:**
- 🏠 **Local**: Full defaults, ready to run
- 🔧 **Dev**: Requires database env vars
- 🚀 **Prod**: Requires all env vars, optimized for performance

**Key syntax:**
- `${VAR:default}` = Environment variable with fallback
- `---` = Separator between profiles
- `on-profile: name` = Activates when profile matches

**Access in code:**
- `@Value("${property.name}")`
- `@ConfigurationProperties`
- `Environment.getProperty()`

