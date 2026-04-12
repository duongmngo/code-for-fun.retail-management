# Project Setup Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 1-2
- **Status**: Not Started

---

## Backend Setup

### Spring Boot Project Initialization
- [ ] Initialize Spring Boot 3.2+ project with Java 21
- [ ] Configure Gradle build with required dependencies:
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring Validation
  - Lombok
  - MapStruct
  - Flyway
  - PostgreSQL Driver
  - Redis (Spring Data Redis)
  - OpenAPI (springdoc-openapi)

### Database Configuration
- [ ] Set up PostgreSQL database connection
- [ ] Configure HikariCP connection pool settings
- [ ] Configure Flyway for database migrations
- [ ] Create initial migration structure
- [ ] Set up Redis for caching

### Development Environment
- [ ] Configure Docker and docker-compose for local development
  - PostgreSQL container
  - Redis container
  - Application container (optional)
- [ ] Create environment-specific configs (dev, staging, prod)
- [ ] Set up application.yml with profiles

### CI/CD & Quality
- [ ] Set up GitHub Actions CI/CD pipeline
  - Build and test on PR
  - Build Docker image on merge
  - Deploy to staging on release
- [ ] Configure code quality tools:
  - Checkstyle for code style
  - SpotBugs for bug detection
  - JaCoCo for code coverage

### Logging & Monitoring
- [ ] Set up logging with structured JSON format
- [ ] Configure log levels per environment
- [ ] Add correlation ID for request tracing

### API Documentation
- [ ] Configure OpenAPI/Swagger documentation
- [ ] Set up Swagger UI endpoint
- [ ] Create API versioning structure

---

## Frontend Setup

### Next.js Project Initialization
- [ ] Initialize Next.js 14+ project with TypeScript
- [ ] Configure App Router structure
- [ ] Set up path aliases (@/components, @/lib, etc.)

### Styling
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up theme configuration (light/dark mode)
- [ ] Create base component library structure

### Code Quality
- [ ] Set up ESLint with strict rules
- [ ] Configure Prettier
- [ ] Configure Husky pre-commit hooks
- [ ] Set up lint-staged

### PWA Configuration
- [ ] Configure PWA with next-pwa
- [ ] Create manifest.json
- [ ] Set up service worker basics
- [ ] Configure offline fallback page

### State Management & Data
- [ ] Set up IndexedDB with Dexie.js
- [ ] Configure TanStack Query (React Query)
- [ ] Set up Zustand stores structure
- [ ] Create API client with fetch wrapper

### Testing
- [ ] Set up Vitest for unit testing
- [ ] Configure Playwright for E2E testing
- [ ] Create test utilities and helpers

---

## Folder Structure

### Backend (Modular Monolith)
```
src/main/java/com/retailmanagement/
├── RetailManagementApplication.java
├── common/
│   ├── config/
│   ├── exception/
│   ├── security/
│   └── util/
├── auth/
├── tenant/
├── product/
├── inventory/
├── sales/
├── sync/
└── reporting/
```

### Frontend
```
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
├── components/
│   ├── ui/
│   └── features/
├── lib/
│   ├── api/
│   ├── hooks/
│   ├── stores/
│   └── utils/
├── types/
└── styles/
```

---

## Acceptance Criteria

- [ ] Backend application starts successfully
- [ ] Frontend application starts successfully
- [ ] Database migrations run without errors
- [ ] Docker compose brings up all services
- [ ] CI pipeline passes on test commit
- [ ] Swagger UI accessible at /swagger-ui
- [ ] PWA installable on Chrome

---

## Dependencies

None - this is the first task.

## Blocks

- All other features depend on this setup.
