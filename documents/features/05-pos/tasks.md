# Point of Sale (POS) Module Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 6-9
- **Status**: Not Started
- **Priority**: P0 (Critical)

---

## Backend Tasks

### Entities & Database

#### Sale Entity
- [ ] Create Sale entity:
  - id, saleNumber (tenant-scoped sequence)
  - tenantId, branchId, cashierId
  - customerId (nullable)
  - saleType: RETAIL, WHOLESALE
  - status: PENDING, COMPLETED, VOIDED, REFUNDED
  - subtotal, discountAmount, taxAmount, totalAmount
  - paidAmount, changeAmount
  - notes
  - completedAt, voidedAt
  - createdAt, updatedAt

#### SaleItem Entity
- [ ] Create SaleItem entity:
  - id, saleId
  - productId, variantId
  - productName, variantName, sku (snapshot)
  - quantity
  - unitPrice (price at time of sale)
  - unitCost (cost snapshot for profit calculation)
  - discountAmount, discountPercent
  - taxAmount
  - totalAmount
  - notes

#### SalePayment Entity
- [ ] Create SalePayment entity:
  - id, saleId
  - paymentMethodId
  - amount
  - referenceNumber (for cards, transfers)
  - status: PENDING, COMPLETED, FAILED, REFUNDED
  - processedAt

#### PaymentMethod Entity
- [ ] Create PaymentMethod entity:
  - id, tenantId
  - name (Cash, Card, Bank Transfer, etc.)
  - type: CASH, CARD, DIGITAL, BANK_TRANSFER
  - isActive
  - requiresReference (boolean)
  - displayOrder

#### Receipt Entity
- [ ] Create Receipt entity:
  - id, saleId
  - receiptNumber
  - printedAt
  - format: THERMAL, A4

#### Refund Entity
- [ ] Create Refund entity:
  - id, saleId
  - refundNumber
  - reason
  - items (JSON array of refunded items)
  - refundAmount
  - refundMethodId
  - status
  - processedBy, processedAt

- [ ] Write Flyway migrations for all tables
- [ ] Add indexes for sale queries

### Sale Service
- [ ] Implement sale creation (draft)
- [ ] Implement item addition/removal
- [ ] Implement item quantity update
- [ ] Implement line item discount
- [ ] Implement whole cart discount
- [ ] Implement sale completion
- [ ] Implement sale void (with permission check)
- [ ] Implement sale hold/retrieve

### Payment Service
- [ ] Implement payment processing
- [ ] Implement split payment (multiple methods)
- [ ] Implement change calculation
- [ ] Implement payment validation

### Pricing Service
- [ ] Calculate item prices (base + modifiers)
- [ ] Apply quantity-based discounts
- [ ] Apply customer-specific prices
- [ ] Calculate taxes
- [ ] Apply promotions (Phase 2)

### Inventory Integration
- [ ] Check stock availability before sale
- [ ] Reserve stock during checkout
- [ ] Decrease stock on completion
- [ ] Restore stock on void/refund

### Receipt Service
- [ ] Generate receipt content
- [ ] Support thermal printer format
- [ ] Support A4 format
- [ ] Include QR code for digital receipt

### Refund Service
- [ ] Implement full refund
- [ ] Implement partial refund (select items)
- [ ] Restore stock on refund
- [ ] Link refund to original sale

### End of Day
- [ ] Cash drawer management
- [ ] Shift open/close
- [ ] Cash counts
- [ ] X-Report (mid-shift summary)
- [ ] Z-Report (end of day summary)

### Events
- [ ] Publish SaleCompletedEvent
- [ ] Publish SaleVoidedEvent
- [ ] Publish RefundCompletedEvent

### Testing
- [ ] Unit tests for SaleService
- [ ] Unit tests for PricingService
- [ ] Unit tests for payment calculations
- [ ] Integration tests for sale flow
- [ ] Test split payments
- [ ] Test void and refund flows

---

## Frontend Tasks

### POS Interface
- [ ] Create POS main page (/pos)
  - Product grid/list
  - Cart panel
  - Customer info
  - Quick actions
- [ ] Implement responsive design (tablet-first)
- [ ] Implement touch-optimized UI

### Product Selection
- [ ] Create ProductGrid component
  - Category tabs/filter
  - Quick search
  - Variant selector modal
- [ ] Create BarcodeScanner integration
- [ ] Create QuickSearch component
  - Search by name, SKU, barcode
  - Keyboard navigation
- [ ] Create VariantSelector modal

### Cart Management
- [ ] Create CartPanel component
- [ ] Create CartItem component
  - Quantity +/-
  - Inline price edit (with permission)
  - Line discount
  - Remove item
- [ ] Create CartDiscountDialog
- [ ] Create CustomerSelector
- [ ] Implement cart persistence (local storage)

### Checkout Flow
- [ ] Create CheckoutDialog
- [ ] Create PaymentMethodSelector
- [ ] Create SplitPaymentUI
- [ ] Create ChangeCalculator
- [ ] Create PaymentKeypad (for cash entry)

### Payment Integration
- [ ] Cash payment handling
- [ ] Card payment (manual entry or terminal)
- [ ] QR payment display
- [ ] Bank transfer confirmation

### Receipt & Print
- [ ] Create ReceiptPreview component
- [ ] Implement print functionality
- [ ] Thermal printer support (ESC/POS)
- [ ] Email receipt option
- [ ] WhatsApp receipt sharing

### Sale Management
- [ ] Create HeldSales list
- [ ] Create SaleHistory page (/sales)
- [ ] Create SaleDetail page (/sales/{id})
- [ ] Implement sale void flow
- [ ] Implement refund flow

### Quick Actions
- [ ] Park sale (hold)
- [ ] Recall held sale
- [ ] Void current sale
- [ ] Print last receipt
- [ ] Open cash drawer

### Keyboard Shortcuts
- [ ] Implement keyboard navigation
- [ ] F-keys for quick actions
- [ ] Numpad for quantity
- [ ] Enter to complete

### Shift Management
- [ ] Create ShiftOpenDialog
- [ ] Create ShiftCloseDialog
  - Cash count entry
  - Variance calculation
- [ ] Create XReport page
- [ ] Create ZReport page

### Offline POS
- [ ] Implement offline sale creation
- [ ] Queue sales in IndexedDB
- [ ] Show offline indicator
- [ ] Sync when online
- [ ] Handle sync conflicts

### Testing
- [ ] Write tests for CartPanel
- [ ] Write tests for CheckoutDialog
- [ ] Write tests for PaymentKeypad
- [ ] E2E test for complete sale flow
- [ ] E2E test for offline sale

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/sales | Create new sale | Yes |
| GET | /api/v1/sales/{id} | Get sale details | Yes |
| PUT | /api/v1/sales/{id}/items | Update items | Yes |
| POST | /api/v1/sales/{id}/complete | Complete sale | Yes |
| POST | /api/v1/sales/{id}/void | Void sale | Yes |
| POST | /api/v1/sales/{id}/hold | Hold sale | Yes |
| GET | /api/v1/sales/held | List held sales | Yes |
| POST | /api/v1/sales/{id}/payments | Add payment | Yes |
| POST | /api/v1/sales/{id}/receipt | Generate receipt | Yes |
| POST | /api/v1/refunds | Create refund | Yes |
| GET | /api/v1/shifts/current | Get current shift | Yes |
| POST | /api/v1/shifts/open | Open shift | Yes |
| POST | /api/v1/shifts/close | Close shift | Yes |
| GET | /api/v1/shifts/{id}/x-report | X-Report | Yes |
| GET | /api/v1/shifts/{id}/z-report | Z-Report | Yes |
| GET | /api/v1/payment-methods | List payment methods | Yes |

---

## Data Models

### CreateSaleRequest
```json
{
  "branchId": "uuid",
  "customerId": "uuid",
  "items": [
    {
      "variantId": "uuid",
      "quantity": 2,
      "discountAmount": 10000
    }
  ]
}
```

### SaleResponse
```json
{
  "id": "uuid",
  "saleNumber": "S-20240115-0001",
  "status": "COMPLETED",
  "customer": {
    "id": "uuid",
    "name": "John Doe"
  },
  "items": [
    {
      "productName": "Summer Dress",
      "variantName": "Red - S",
      "quantity": 2,
      "unitPrice": 500000,
      "discountAmount": 10000,
      "totalAmount": 990000
    }
  ],
  "subtotal": 1000000,
  "discountAmount": 10000,
  "taxAmount": 0,
  "totalAmount": 990000,
  "payments": [
    {
      "method": "Cash",
      "amount": 1000000
    }
  ],
  "paidAmount": 1000000,
  "changeAmount": 10000,
  "completedAt": "2024-01-15T10:30:00Z"
}
```

### ShiftCloseRequest
```json
{
  "cashCounts": {
    "100000": 5,
    "50000": 10,
    "20000": 15,
    "10000": 20,
    "5000": 10,
    "2000": 25,
    "1000": 50
  },
  "expectedCash": 2500000,
  "actualCash": 2450000,
  "variance": -50000,
  "varianceNote": "Short 50k, to investigate"
}
```

---

## Acceptance Criteria

- [ ] User can add products to cart by search, barcode, or grid
- [ ] User can modify quantities and apply discounts
- [ ] User can complete sale with single or split payment
- [ ] Receipt prints correctly on thermal printer
- [ ] User can void sale (with proper permission)
- [ ] User can process refunds
- [ ] Stock decreases on sale completion
- [ ] POS works offline and syncs when online
- [ ] Shift management tracks all cash movements
- [ ] Z-Report shows accurate daily summary

---

## Dependencies

- **Requires**: 03-product, 04-inventory, 01-authentication

## Blocks

- 07-reporting (needs sales data)
- 06-offline-sync (implements POS offline)
