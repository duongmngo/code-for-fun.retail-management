# Payment Configuration Module Tasks

## Overview
- **Phase**: 2 - F&B Extensions
- **Timeline**: Week 14
- **Status**: Not Started
- **Priority**: P2 (Medium)

---

## Backend Tasks

### Entities & Database

#### PaymentMethod Entity (Enhanced)
- [ ] Enhance PaymentMethod entity:
  - id, tenantId
  - name, displayName
  - type: CASH, CARD, BANK_TRANSFER, DIGITAL_WALLET, VOUCHER, STORE_CREDIT
  - provider: MANUAL, STRIPE, MOMO, VNPAY, ZALOPAY, etc.
  - configuration (JSON - provider-specific config)
  - requiresReference (for tracking)
  - allowsPartial (can be used with other methods)
  - allowsRefund
  - transactionFee (percentage or flat)
  - isActive
  - displayOrder

#### PaymentGateway Entity
- [ ] Create PaymentGateway entity:
  - id, tenantId
  - provider
  - merchantId
  - apiKey (encrypted)
  - secretKey (encrypted)
  - webhookSecret
  - environment: SANDBOX, PRODUCTION
  - isActive

#### PaymentTransaction Entity
- [ ] Create PaymentTransaction entity:
  - id, tenantId
  - saleId
  - paymentMethodId
  - gatewayId (nullable)
  - amount
  - status: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
  - providerTransactionId
  - providerResponse (JSON)
  - errorMessage
  - processedAt

- [ ] Write Flyway migrations

### Payment Method Service
- [ ] Implement payment method CRUD
- [ ] Configure transaction fees
- [ ] Enable/disable per branch
- [ ] Sort display order

### Payment Gateway Service
- [ ] Implement gateway configuration
- [ ] Secure credential storage
- [ ] Test connection/credentials
- [ ] Gateway health monitoring

### Payment Processing Service
- [ ] Abstract payment processor interface
- [ ] Cash payment processor
- [ ] Manual card processor (no integration)
- [ ] VNPay payment processor (stub)
- [ ] MoMo payment processor (stub)
- [ ] ZaloPay payment processor (stub)

### Transaction Management
- [ ] Create payment transaction
- [ ] Update transaction status
- [ ] Handle webhooks
- [ ] Transaction reconciliation

### Security
- [ ] Encrypt API keys at rest
- [ ] Validate webhook signatures
- [ ] Audit payment operations
- [ ] PCI compliance considerations

### Testing
- [ ] Unit tests for payment processors
- [ ] Test transaction flows
- [ ] Test refund flows
- [ ] Mock gateway responses

---

## Frontend Tasks

### Payment Method Management
- [ ] Create payment methods page (/settings/payments)
- [ ] Create payment method form
  - Basic settings
  - Fee configuration
  - Provider settings
- [ ] Enable/disable toggles
- [ ] Drag-drop reordering

### Gateway Configuration
- [ ] Create gateway settings page
- [ ] Secure credential entry
- [ ] Test connection button
- [ ] Environment toggle

### POS Integration
- [ ] Show configured payment methods
- [ ] Handle each payment type
- [ ] Display QR codes for digital payments
- [ ] Show transaction status

### Transaction Monitoring
- [ ] Transaction list view
- [ ] Transaction detail view
- [ ] Status filters
- [ ] Reconciliation tools

### Testing
- [ ] Test payment method CRUD
- [ ] Test gateway configuration
- [ ] Test POS payment flows

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/payment-methods | List payment methods | Yes |
| POST | /api/v1/payment-methods | Create payment method | Yes |
| PUT | /api/v1/payment-methods/{id} | Update payment method | Yes |
| DELETE | /api/v1/payment-methods/{id} | Delete payment method | Yes |
| PUT | /api/v1/payment-methods/order | Update order | Yes |
| GET | /api/v1/payment-gateways | List gateways | Yes |
| POST | /api/v1/payment-gateways | Create gateway | Yes |
| PUT | /api/v1/payment-gateways/{id} | Update gateway | Yes |
| POST | /api/v1/payment-gateways/{id}/test | Test connection | Yes |
| GET | /api/v1/transactions | List transactions | Yes |
| GET | /api/v1/transactions/{id} | Get transaction | Yes |
| POST | /api/v1/webhooks/{provider} | Payment webhooks | No* |

---

## Data Models

### PaymentMethodResponse
```json
{
  "id": "uuid",
  "name": "Cash",
  "displayName": "Tiền mặt",
  "type": "CASH",
  "provider": "MANUAL",
  "requiresReference": false,
  "allowsPartial": true,
  "allowsRefund": true,
  "transactionFee": {
    "type": "NONE",
    "value": 0
  },
  "isActive": true,
  "displayOrder": 1
}
```

### PaymentGatewayConfig
```json
{
  "provider": "VNPAY",
  "merchantId": "merchant_id",
  "apiKey": "••••••••",
  "environment": "SANDBOX",
  "webhookUrl": "https://api.example.com/webhooks/vnpay",
  "returnUrl": "https://pos.example.com/payment/callback"
}
```

### TransactionResponse
```json
{
  "id": "uuid",
  "saleId": "uuid",
  "saleNumber": "S-20240115-001",
  "amount": 500000,
  "paymentMethod": "VNPay",
  "status": "COMPLETED",
  "providerTransactionId": "VNP123456",
  "processedAt": "2024-01-15T10:30:00Z"
}
```

---

## Supported Payment Providers

| Provider | Type | Status | Notes |
|----------|------|--------|-------|
| Manual Cash | CASH | ✅ MVP | No integration |
| Manual Card | CARD | ✅ MVP | No integration |
| Bank Transfer | BANK_TRANSFER | ✅ MVP | Manual verification |
| VNPay | DIGITAL | 🔲 Phase 2 | Popular in Vietnam |
| MoMo | DIGITAL_WALLET | 🔲 Phase 2 | Mobile wallet |
| ZaloPay | DIGITAL_WALLET | 🔲 Phase 2 | Mobile wallet |
| Stripe | CARD | 🔲 Phase 3 | International |

---

## Acceptance Criteria

- [ ] Multiple payment methods can be configured
- [ ] Payment methods appear in POS by configured order
- [ ] Transaction fees apply correctly
- [ ] Credentials are stored securely
- [ ] Gateway connections can be tested
- [ ] Transactions are logged and queryable
- [ ] Webhooks process payment updates
- [ ] Refunds work for supported methods

---

## Dependencies

- **Requires**: 05-pos

## Blocks

- None
