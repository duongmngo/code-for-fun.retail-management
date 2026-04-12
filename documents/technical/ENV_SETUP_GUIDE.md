# Environment Variables Setup Guide

## Overview
This guide explains all the ways to configure environment variables and ports for the Retail Management Spring Boot application.

## 🎯 Quick Start

### Option 1: Create `.env` file (Recommended for Local Development)

1. Copy the example file:
   ```bash
   cd src/backend
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```bash
   # Change port
   SERVER_PORT=8081
   
   # Change database
   DATABASE_URL=jdbc:postgresql://localhost:5432/my_database
   POSTGRES_USER=myuser
   POSTGRES_PASSWORD=mypassword
   ```

3. Load the `.env` file when running:
   ```bash
   # Option A: Using source (bash/zsh)
   source .env && ./gradlew bootRun
   
   # Option B: Using export
   export $(cat .env | xargs) && ./gradlew bootRun
   
   # Option C: Using env
   env $(cat .env | xargs) ./gradlew bootRun
   ```

---

## 📍 All Configuration Methods

### 1️⃣ **application.yml** (Default Values)
Location: `src/main/resources/application.yml`

The default configuration with fallback values:
```yaml
server:
  port: ${SERVER_PORT:8080}  # Defaults to 8080 if not set
```

**Pros**: Version controlled, shared across team
**Cons**: Not suitable for sensitive data

---

### 2️⃣ **Environment Variables** (Recommended for Production)

#### macOS/Linux (Current Shell Session):
```bash
export SERVER_PORT=8081
export DATABASE_URL=jdbc:postgresql://localhost:5432/retail_management
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres123
./gradlew bootRun
```

#### Make it Persistent (Add to `~/.zshrc` or `~/.bash_profile`):
```bash
echo 'export SERVER_PORT=8081' >> ~/.zshrc
source ~/.zshrc
```

---

### 3️⃣ **IntelliJ IDEA Configuration** (Best for JetBrains IDEs)

#### Run Configuration:
1. Open **Run > Edit Configurations**
2. Select your Spring Boot application
3. In **Environment Variables** section, add:
   ```
   SERVER_PORT=8081;DATABASE_URL=jdbc:postgresql://localhost:5432/retail_management;POSTGRES_USER=postgres;POSTGRES_PASSWORD=postgres123
   ```
   Or click **Browse** button and add them one by one

#### EnvFile Plugin (Recommended):
1. Install the **EnvFile** plugin
2. Go to **Run > Edit Configurations**
3. Enable **EnvFile** tab
4. Add your `.env` file
5. Run the application

---

### 4️⃣ **Gradle Command Line**

```bash
# Single variable
./gradlew bootRun --args='--server.port=8081'

# Multiple variables
./gradlew bootRun --args='--server.port=8081 --spring.datasource.url=jdbc:postgresql://localhost:5432/retail_management'

# Or using -D flags
./gradlew bootRun -Dserver.port=8081
```

---

### 5️⃣ **Profile-Specific Files** (Different Environments)

Create environment-specific files:
- `application-local.yml` (for local development)
- `application-dev.yml` (for development server)
- `application-prod.yml` (for production)

Then activate with:
```bash
export SPRING_PROFILES_ACTIVE=local
./gradlew bootRun
```

Or:
```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```

---

### 6️⃣ **Docker / Docker Compose**

Location: `docker/docker-compose.yml`

```yaml
services:
  app:
    environment:
      - SERVER_PORT=8080
      - DATABASE_URL=jdbc:postgresql://db:5432/retail_management
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres123
    # Or use env_file
    env_file:
      - .env
```

---

### 7️⃣ **System Properties**

```bash
java -jar -Dserver.port=8081 -Dspring.datasource.url=jdbc:postgresql://localhost:5432/retail_management build/libs/retail-management-api-0.0.1-SNAPSHOT.jar
```

---

## 🔧 Available Configuration Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `local` | Active Spring profile (local, dev, prod) |
| `SERVER_PORT` | `8080` | Server port |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/retail_management` | PostgreSQL connection URL |
| `POSTGRES_USER` | `postgres` | Database username |
| `POSTGRES_PASSWORD` | `postgres123` | Database password |
| `REDIS_URL` | `redis://:redis_password_123@localhost:6379` | Redis connection URL |
| `JWT_SECRET` | *(default)* | JWT signing secret (256+ bits) |

---

## 🎨 Change Port - Quick Commands

### Temporary (One-time):
```bash
SERVER_PORT=8081 ./gradlew bootRun
```

### Using application.yml:
```yaml
server:
  port: 8081
```

### Using command line:
```bash
./gradlew bootRun --args='--server.port=8081'
```

### Check which port is running:
```bash
lsof -i :8080  # Check if 8080 is in use
lsof -i -P | grep LISTEN | grep java  # See all Java listening ports
```

---

## 🔒 Security Best Practices

1. ✅ **Never commit `.env` files** - Already in `.gitignore`
2. ✅ **Use different secrets per environment**
3. ✅ **Rotate JWT secrets regularly in production**
4. ✅ **Use environment variables for sensitive data**
5. ✅ **Use secrets management in production** (AWS Secrets Manager, HashiCorp Vault, etc.)

---

## 🚀 Recommended Setup by Environment

### Local Development:
- Use `.env` file + IntelliJ EnvFile plugin
- Or export variables in terminal

### Development Server:
- Use environment variables on server
- Or Docker Compose with env_file

### Production:
- Use platform-specific secrets management
- Kubernetes Secrets / AWS Secrets Manager / Azure Key Vault
- Never hardcode in application files

---

## 🐛 Troubleshooting

### Port already in use:
```bash
# Find what's using the port
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Environment variables not loading:
```bash
# Verify they're set
echo $SERVER_PORT
printenv | grep SERVER_PORT

# Check Spring is reading them
# Look for this in logs:
# "The following 1 profile is active: "local""
# "Tomcat started on port(s): 8080"
```

### Check effective configuration:
Access: http://localhost:8080/api/actuator/env
(May need to enable this endpoint in application.yml)

---

## 📚 Additional Resources

- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Spring Boot Configuration Properties](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)

