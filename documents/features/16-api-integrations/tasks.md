# API Integrations & Public API Module Tasks

## Overview
- **Phase**: 3 - Enterprise Features
- **Timeline**: Week 18-20
- **Status**: Not Started
- **Priority**: P3 (Low)

---

## Backend Tasks

### Public API Infrastructure

#### API Versioning
- [ ] Implement /api/v1 versioning
- [ ] Version-specific controllers
- [ ] Deprecation headers
- [ ] Version documentation

#### API Authentication
- [ ] Create API Key entity:
  - id, tenantId
  - name, description
  - keyHash (hashed, store hash only)
  - permissions (scopes)
  - rateLimit
  - expiresAt
  - isActive, createdAt, lastUsedAt
- [ ] Implement API key validation
- [ ] Implement OAuth2 (optional)
- [ ] JWT for API access

#### Rate Limiting
- [ ] Implement per-key rate limiting
- [ ] Implement global rate limiting
- [ ] Use Redis for counters
- [ ] Return rate limit headers
- [ ] Configurable limits

#### Request/Response
- [ ] Standardize response format
- [ ] Error response format
- [ ] Pagination standard
- [ ] Filtering/sorting standard
- [ ] Field selection (sparse fieldsets)

### Public API Endpoints

#### Products API
- [ ] GET /api/v1/public/products
- [ ] GET /api/v1/public/products/{id}
- [ ] GET /api/v1/public/categories
- [ ] Product search
- [ ] Stock availability check

#### Orders/Sales API
- [ ] POST /api/v1/public/orders - Create order
- [ ] GET /api/v1/public/orders/{id}
- [ ] PUT /api/v1/public/orders/{id}/cancel
- [ ] Order status webhook

#### Customers API
- [ ] GET /api/v1/public/customers
- [ ] POST /api/v1/public/customers
- [ ] PUT /api/v1/public/customers/{id}
- [ ] GET /api/v1/public/customers/{id}/loyalty

#### Inventory API
- [ ] GET /api/v1/public/inventory
- [ ] GET /api/v1/public/inventory/{sku}
- [ ] Webhook for stock changes

### Webhooks System
- [ ] Create Webhook entity:
  - id, tenantId
  - url
  - events (array of event types)
  - secret (for signing)
  - isActive, createdAt
- [ ] Implement webhook delivery
- [ ] Implement retry logic
- [ ] Implement signature verification
- [ ] Webhook logs

### Third-Party Integrations

#### E-commerce Platforms
- [ ] Shopify integration (stub)
- [ ] WooCommerce integration (stub)
- [ ] Lazada integration (stub)
- [ ] Shopee integration (stub)

#### Accounting
- [ ] QuickBooks integration (stub)
- [ ] MISA integration (stub)
- [ ] Export to accounting format

#### Delivery
- [ ] GrabExpress integration (stub)
- [ ] Giao Hang Nhanh integration (stub)
- [ ] Shipping rate calculation

### API Documentation
- [ ] OpenAPI/Swagger spec
- [ ] Swagger UI endpoint
- [ ] ReDoc documentation
- [ ] Code examples
- [ ] Postman collection

### Testing
- [ ] API endpoint tests
- [ ] Rate limiting tests
- [ ] Webhook delivery tests
- [ ] Integration tests

---

## Frontend Tasks

### API Key Management
- [ ] Create API keys page (/settings/api)
- [ ] Generate new API key
- [ ] Display key once (masked after)
- [ ] Manage key permissions
- [ ] Revoke keys

### Webhook Configuration
- [ ] Webhook list page
- [ ] Create webhook form
- [ ] Select events to subscribe
- [ ] Test webhook delivery
- [ ] View delivery logs

### Integration Store
- [ ] Available integrations page
- [ ] Enable/disable integrations
- [ ] Configure integration settings
- [ ] Connection status

### API Documentation Portal
- [ ] Embedded API docs
- [ ] Interactive API explorer
- [ ] Code examples in multiple languages
- [ ] Authentication guide

### Usage Dashboard
- [ ] API usage statistics
- [ ] Request volume chart
- [ ] Error rates
- [ ] Top endpoints

### Testing
- [ ] Test API key management
- [ ] Test webhook configuration
- [ ] Test integration setup

---

## API Endpoints (Internal)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/api-keys | List API keys | Yes |
| POST | /api/v1/api-keys | Create API key | Yes |
| DELETE | /api/v1/api-keys/{id} | Revoke key | Yes |
| GET | /api/v1/webhooks | List webhooks | Yes |
| POST | /api/v1/webhooks | Create webhook | Yes |
| PUT | /api/v1/webhooks/{id} | Update webhook | Yes |
| DELETE | /api/v1/webhooks/{id} | Delete webhook | Yes |
| POST | /api/v1/webhooks/{id}/test | Test webhook | Yes |
| GET | /api/v1/webhooks/{id}/logs | Delivery logs | Yes |
| GET | /api/v1/integrations | List integrations | Yes |
| POST | /api/v1/integrations/{id}/enable | Enable | Yes |
| POST | /api/v1/integrations/{id}/configure | Configure | Yes |

---

## Data Models

### API Key Management
```json
{
  "id": "uuid",
  "name": "E-commerce Integration",
  "keyPrefix": "rtm_live_abc...",
  "permissions": ["read:products", "read:inventory", "write:orders"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerDay": 10000
  },
  "expiresAt": "2025-01-01",
  "lastUsedAt": "2024-01-15T10:30:00Z",
  "isActive": true
}
```

### Webhook Configuration
```json
{
  "id": "uuid",
  "url": "https://example.com/webhooks/retail",
  "events": [
    "order.created",
    "order.completed",
    "stock.low",
    "stock.updated"
  ],
  "secret": "whsec_...",
  "isActive": true,
  "lastDelivery": {
    "timestamp": "2024-01-15T10:30:00Z",
    "status": "SUCCESS"
  }
}
```

### Webhook Payload
```json
{
  "id": "evt_uuid",
  "type": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-001",
    "totalAmount": 500000
  },
  "signature": "sha256=..."
}
```

### Standard API Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  },
  "links": {
    "self": "/api/v1/products?page=1",
    "next": "/api/v1/products?page=2"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## API Scopes

| Scope | Description |
|-------|-------------|
| read:products | Read product catalog |
| write:products | Create/update products |
| read:inventory | Read stock levels |
| write:inventory | Update stock |
| read:orders | Read orders/sales |
| write:orders | Create orders |
| read:customers | Read customer data |
| write:customers | Create/update customers |

---

## Webhook Events

| Event | Description | Payload |
|-------|-------------|---------|
| order.created | New order placed | Order details |
| order.completed | Order completed | Order + payment |
| order.cancelled | Order cancelled | Order + reason |
| stock.low | Stock below threshold | Product + level |
| stock.updated | Stock changed | Product + movement |
| customer.created | New customer | Customer details |
| product.updated | Product changed | Product details |

---

## Acceptance Criteria

- [ ] API keys can be generated and managed
- [ ] API authentication with keys works
- [ ] Rate limiting enforces limits
- [ ] Public API endpoints function correctly
- [ ] API documentation is accessible
- [ ] Webhooks deliver with retry
- [ ] Webhook signatures verify correctly
- [ ] Integration settings save properly
- [ ] API usage is tracked and displayed
- [ ] Error responses are consistent

---

## Dependencies

- **Requires**: Core modules (auth, products, inventory, customers)

## Blocks

- None
