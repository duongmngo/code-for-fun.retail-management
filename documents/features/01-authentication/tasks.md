# Authentication Module Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 2-3
- **Status**: Not Started
- **Priority**: P0 (Critical)

---

## Backend Tasks

### Entities & Database
- [ ] Create User entity with fields:
  - id, email, password (hashed), firstName, lastName
  - role (OWNER, MANAGER, CASHIER, INVENTORY_STAFF)
  - tenantId, branchId (assigned branch)
  - pin (hashed, for quick POS login)
  - isActive, createdAt, updatedAt
- [ ] Create RefreshToken entity:
  - id, token, userId, expiresAt, createdAt
- [ ] Create AuditLog entity for auth events
- [ ] Write Flyway migrations for auth tables

### JWT Implementation
- [ ] Configure JWT properties (secret, expiration)
- [ ] Implement JwtTokenProvider:
  - generateAccessToken(UserPrincipal)
  - generateRefreshToken(UserPrincipal)
  - validateToken(String token)
  - getUserIdFromToken(String token)
- [ ] Create JwtAuthenticationFilter
- [ ] Create JwtAuthenticationEntryPoint

### Auth Service
- [ ] Implement login endpoint (POST /api/v1/auth/login)
  - Validate email/password
  - Return access token + refresh token
- [ ] Implement refresh token endpoint (POST /api/v1/auth/refresh)
  - Validate refresh token
  - Generate new access token
  - Optionally rotate refresh token
- [ ] Implement logout endpoint (POST /api/v1/auth/logout)
  - Revoke refresh token
- [ ] Implement PIN-based quick login (POST /api/v1/auth/pin-login)
  - For POS terminal fast switching

### Password Management
- [ ] Implement password reset request (POST /api/v1/auth/forgot-password)
- [ ] Implement password reset (POST /api/v1/auth/reset-password)
- [ ] Implement change password (POST /api/v1/auth/change-password)
- [ ] Configure BCrypt password encoder

### Role-Based Access Control (RBAC)
- [ ] Define Permission enum
- [ ] Create role-permission mapping
- [ ] Implement @PreAuthorize annotations
- [ ] Create custom security expressions

### Security Configuration
- [ ] Configure SecurityFilterChain
- [ ] Set up CORS configuration
- [ ] Configure rate limiting for auth endpoints
- [ ] Add brute force protection (account lockout)

### Audit Logging
- [ ] Log successful logins
- [ ] Log failed login attempts
- [ ] Log password changes
- [ ] Log permission denied events

### Testing
- [ ] Write unit tests for JwtTokenProvider
- [ ] Write unit tests for AuthService
- [ ] Write integration tests for auth endpoints
- [ ] Test JWT expiration handling
- [ ] Test refresh token rotation

---

## Frontend Tasks

### Pages
- [ ] Create login page (/login)
  - Email/password form
  - "Remember me" checkbox
  - "Forgot password" link
  - Social login buttons (future)
- [ ] Create registration page (/register) - for tenant owners
- [ ] Create forgot password page (/forgot-password)
- [ ] Create reset password page (/reset-password)

### Components
- [ ] Create LoginForm component
- [ ] Create RegisterForm component
- [ ] Create PinLoginModal component (for POS quick switch)
- [ ] Create ProtectedRoute wrapper
- [ ] Create RoleGuard component

### Auth Context & Hooks
- [ ] Create AuthContext/AuthProvider
- [ ] Implement useAuth hook:
  - user, isAuthenticated, isLoading
  - login(), logout(), refreshToken()
- [ ] Create usePermission hook
- [ ] Implement token refresh logic (silent refresh)

### Token Management
- [ ] Store access token in memory (not localStorage)
- [ ] Store refresh token in httpOnly cookie (if possible) or secure storage
- [ ] Implement automatic token refresh before expiry
- [ ] Handle 401 responses globally

### Offline Considerations
- [ ] Store encrypted credentials for offline login (optional)
- [ ] Implement logout warning for pending sync items
- [ ] Handle session expiry gracefully

### Testing
- [ ] Write tests for LoginForm
- [ ] Write tests for auth hooks
- [ ] Write E2E test for login flow
- [ ] Test token refresh behavior

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/auth/login | Login with email/password | No |
| POST | /api/v1/auth/refresh | Refresh access token | No (uses refresh token) |
| POST | /api/v1/auth/logout | Logout and revoke tokens | Yes |
| POST | /api/v1/auth/pin-login | Quick login with PIN | No |
| POST | /api/v1/auth/forgot-password | Request password reset | No |
| POST | /api/v1/auth/reset-password | Reset password with token | No |
| POST | /api/v1/auth/change-password | Change password | Yes |
| GET | /api/v1/auth/me | Get current user | Yes |

---

## Data Models

### LoginRequest
```json
{
  "email": "string",
  "password": "string",
  "rememberMe": "boolean"
}
```

### LoginResponse
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "OWNER|MANAGER|CASHIER|INVENTORY_STAFF",
    "tenantId": "uuid",
    "branchId": "uuid"
  }
}
```

---

## Security Considerations

- [ ] Use BCrypt with cost factor 12 for password hashing
- [ ] JWT access token expiry: 15 minutes
- [ ] Refresh token expiry: 7 days (or 30 days with "remember me")
- [ ] Implement account lockout after 5 failed attempts
- [ ] Rate limit login endpoint: 10 requests per minute per IP
- [ ] Validate PIN length (4-6 digits)
- [ ] Log all auth events for audit

---

## Acceptance Criteria

- [ ] User can login with email/password
- [ ] User can logout
- [ ] Token refresh works automatically
- [ ] PIN login works for POS
- [ ] Password reset flow works
- [ ] Role-based access control enforced
- [ ] Audit logs capture auth events

---

## Dependencies

- **Requires**: 00-project-setup completed

## Blocks

- 02-multi-tenant (needs auth context)
- All other modules (need authentication)
