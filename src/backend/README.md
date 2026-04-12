# Retail Management API

Spring Boot backend for the Retail Management System.

## Prerequisites

- **Java 21** (configured via `gradle.properties`)
- **PostgreSQL 15+** (running on localhost:5432)
- **Redis 7+** (optional, for caching)
- Gradle 8.5+ (wrapper included)

## Quick Start

### Option A: Using Existing PostgreSQL

If you already have PostgreSQL running, just create the database:

```bash
# Create database (if not exists)
psql -U postgres -c "CREATE DATABASE retail_management;"

# Or using Docker
docker exec -it <postgres-container> psql -U postgres -c "CREATE DATABASE retail_management;"
```

Then start the application:

```bash
./gradlew bootRun
```

### Option B: Using Docker Compose

```bash
cd docker
docker-compose up -d
cd ..
./gradlew bootRun
```

### Database Configuration

Default connection settings in `application.yml`:

| Setting | Default Value |
|---------|---------------|
| Host | `localhost` |
| Port | `5432` |
| Database | `retail_management` |
| Username | `postgres` |
| Password | `postgres123` |

Override with environment variables:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/retail_management \
POSTGRES_USER=postgres \
POSTGRES_PASSWORD=yourpassword \
./gradlew bootRun
```

### Verify Application

```bash
# Health check
curl http://localhost:8080/api/actuator/health
# Expected: {"status":"UP"}
```

### Access Points

- **API Base URL:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/api/swagger-ui.html
- **OpenAPI Docs:** http://localhost:8080/api/api-docs
- **Health Check:** http://localhost:8080/api/actuator/health

## Database Migrations

Flyway runs automatically on startup. Migrations are in `src/main/resources/db/migration/`:

- `V1__init_auth_schema.sql` - Core tables (tenants, users, roles, permissions)
- `V2__seed_permissions_roles.sql` - Default roles and permissions

To check migration status:

```bash
./gradlew flywayInfo
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/auth/signup` | Register new tenant with admin |
| POST | `/v1/auth/signin` | Sign in |
| POST | `/v1/auth/refresh` | Refresh access token |
| POST | `/v1/auth/logout` | Logout |
| POST | `/v1/auth/logout-all` | Logout from all devices |

### Example: Sign Up

```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "tenantCode": "my-store",
    "businessName": "My Store",
    "businessAddress": "123 Main St",
    "businessPhone": "123-456-7890",
    "email": "admin@mystore.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Example: Sign In

```bash
curl -X POST http://localhost:8080/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "tenantCode": "my-store",
    "email": "admin@mystore.com",
    "password": "Password123!"
  }'
```

## Project Structure

```
src/
├── main/
│   ├── java/com/retailmanagement/
│   │   ├── common/              # Shared components
│   │   │   ├── config/          # Spring configurations
│   │   │   ├── dto/             # Common DTOs
│   │   │   ├── exception/       # Exception handling
│   │   │   └── security/        # JWT & Security
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   │       ├── entity/      # JPA entities
│   │   │       └── repository/  # JPA repositories
│   │   └── module/
│   │       └── auth/            # Authentication module
│   │           ├── controller/
│   │           ├── dto/
│   │           └── service/
│   └── resources/
│       ├── application.yml
│       └── db/migration/        # Flyway migrations
└── test/
```

## Database Schema

The initial migration creates:

- `tenants` - Multi-tenant organizations
- `users` - User accounts
- `roles` - Role definitions
- `permissions` - Permission definitions
- `role_permissions` - Role-permission mapping
- `user_roles` - User-role mapping
- `refresh_tokens` - JWT refresh tokens
- `locations` - Warehouses and branches
- `audit_logs` - Security audit trail

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/retail_management` | PostgreSQL connection URL |
| `POSTGRES_USER` | `postgres` | Database username |
| `POSTGRES_PASSWORD` | `postgres123` | Database password |
| `REDIS_URL` | `redis://:redis_password_123@localhost:6379` | Redis connection URL |
| `JWT_SECRET` | (generated) | JWT signing secret |
| `SERVER_PORT` | `8080` | Application port |

## Testing

```bash
# Run all tests
./gradlew test

# Run with coverage report
./gradlew test jacocoTestReport
# Report: build/reports/jacoco/test/html/index.html
```

## Code Quality

```bash
# Checkstyle
./gradlew checkstyleMain

# SpotBugs
./gradlew spotbugsMain

# All checks
./gradlew check
```

## Building

```bash
./gradlew build
```

The JAR file will be created at `build/libs/retail-management-api-0.0.1-SNAPSHOT.jar`

## Troubleshooting

### Port 8080 already in use

```bash
# Find and kill process on port 8080
lsof -ti :8080 | xargs kill -9
```

### Java version issues

The project requires Java 21. If you have multiple Java versions:

```bash
# Check gradle.properties for configured Java home
cat gradle.properties

# Or set JAVA_HOME manually
export JAVA_HOME=/path/to/java21
./gradlew bootRun
```
