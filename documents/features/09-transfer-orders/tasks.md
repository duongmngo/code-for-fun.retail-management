# Transfer Orders Module Tasks

## Overview
- **Phase**: 2 - F&B Extensions
- **Timeline**: Week 11-12
- **Status**: Not Started
- **Priority**: P2 (Medium)

---

## Backend Tasks

### Entities & Database

#### TransferOrder Entity
- [ ] Create TransferOrder entity:
  - id, tenantId
  - transferNumber (auto-generated)
  - sourceWarehouseId (FK)
  - destinationWarehouseId (FK)
  - status: DRAFT, PENDING, IN_TRANSIT, RECEIVED, CANCELLED
  - requestedBy (userId)
  - approvedBy (userId, nullable)
  - requestDate, approvedDate
  - shippedDate, receivedDate
  - notes
  - createdAt, updatedAt

#### TransferOrderItem Entity
- [ ] Create TransferOrderItem entity:
  - id, transferOrderId
  - productId, variantId
  - requestedQuantity
  - approvedQuantity (may differ)
  - shippedQuantity
  - receivedQuantity
  - status: PENDING, PARTIAL, COMPLETE, SHORT

#### TransferOrderHistory Entity
- [ ] Create TransferOrderHistory entity (audit):
  - id, transferOrderId
  - action (CREATED, APPROVED, SHIPPED, RECEIVED, etc.)
  - performedBy
  - notes
  - timestamp

- [ ] Write Flyway migrations
- [ ] Add indexes for queries

### Transfer Order Service

#### Create & Request
- [ ] Implement transfer request creation
- [ ] Validate source warehouse has stock
- [ ] Notify destination warehouse

#### Approval Workflow
- [ ] Submit transfer for approval
- [ ] Approve transfer (with optional qty changes)
- [ ] Reject transfer with reason
- [ ] Auto-approve below threshold (optional)

#### Shipping
- [ ] Mark transfer as shipped
- [ ] Deduct stock from source warehouse
- [ ] Create stock movement records
- [ ] Generate packing list

#### Receiving
- [ ] Mark transfer as received
- [ ] Handle full receiving
- [ ] Handle partial receiving
- [ ] Handle shortages
- [ ] Add stock to destination warehouse
- [ ] Create stock movement records

#### Cancellation
- [ ] Cancel draft transfer
- [ ] Cancel approved transfer (restore stock if shipped)
- [ ] Audit trail for cancellation

### Notifications
- [ ] Notify on new transfer request
- [ ] Notify on transfer approval/rejection
- [ ] Notify on transfer shipped
- [ ] Notify on transfer received

### Events
- [ ] Publish TransferShippedEvent
- [ ] Publish TransferReceivedEvent
- [ ] Subscribe to handle stock updates

### Reports
- [ ] Transfer history report
- [ ] Pending transfers report
- [ ] Transfer by warehouse report
- [ ] Transfer variance report

### Testing
- [ ] Unit tests for TransferOrderService
- [ ] Test approval workflow
- [ ] Test stock updates on ship/receive
- [ ] Integration tests
- [ ] Test partial receiving

---

## Frontend Tasks

### Transfer Order Pages
- [ ] Create transfer list page (/transfers)
  - Status tabs (All, Pending, In Transit, etc.)
  - Filters by warehouse, date
  - Quick actions
- [ ] Create transfer detail page (/transfers/{id})
- [ ] Create transfer form page (/transfers/new)

### Transfer Creation Form
- [ ] Select source warehouse
- [ ] Select destination warehouse
- [ ] Product search and selection
- [ ] Quantity input with stock validation
- [ ] Show available stock
- [ ] Notes field

### Approval UI
- [ ] Pending approval list
- [ ] Approval form
  - Review items
  - Adjust quantities
  - Approve/Reject buttons
  - Rejection reason

### Shipping UI
- [ ] Ship transfer dialog
- [ ] Packing list generation
- [ ] Print packing list
- [ ] Confirm shipment

### Receiving UI
- [ ] Receive transfer form
- [ ] Barcode scanning for verification
- [ ] Enter received quantities
- [ ] Report shortages
- [ ] Confirm receipt

### Notifications UI
- [ ] Show pending transfers badge
- [ ] Transfer status notifications
- [ ] Real-time updates (WebSocket)

### Mobile Optimized
- [ ] Touch-friendly receiving UI
- [ ] Barcode scanner integration
- [ ] Quick quantity input

### Testing
- [ ] Test transfer creation form
- [ ] Test approval workflow
- [ ] Test receiving with scanner
- [ ] E2E test full flow

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/transfers | List transfers | Yes |
| POST | /api/v1/transfers | Create transfer | Yes |
| GET | /api/v1/transfers/{id} | Get transfer details | Yes |
| PUT | /api/v1/transfers/{id} | Update draft transfer | Yes |
| POST | /api/v1/transfers/{id}/submit | Submit for approval | Yes |
| POST | /api/v1/transfers/{id}/approve | Approve transfer | Yes |
| POST | /api/v1/transfers/{id}/reject | Reject transfer | Yes |
| POST | /api/v1/transfers/{id}/ship | Mark as shipped | Yes |
| POST | /api/v1/transfers/{id}/receive | Record receipt | Yes |
| POST | /api/v1/transfers/{id}/cancel | Cancel transfer | Yes |
| GET | /api/v1/transfers/{id}/history | Get audit history | Yes |
| GET | /api/v1/transfers/{id}/packing-list | Generate packing list | Yes |

---

## Data Models

### CreateTransferRequest
```json
{
  "sourceWarehouseId": "uuid",
  "destinationWarehouseId": "uuid",
  "items": [
    {
      "variantId": "uuid",
      "requestedQuantity": 50
    }
  ],
  "notes": "Restocking main store"
}
```

### TransferResponse
```json
{
  "id": "uuid",
  "transferNumber": "TR-20240115-001",
  "status": "IN_TRANSIT",
  "sourceWarehouse": {
    "id": "uuid",
    "name": "Central Warehouse"
  },
  "destinationWarehouse": {
    "id": "uuid",
    "name": "Downtown Store"
  },
  "items": [
    {
      "id": "uuid",
      "productName": "Summer Dress",
      "variantName": "Red - M",
      "sku": "DRESS-001-RED-M",
      "requestedQuantity": 50,
      "approvedQuantity": 50,
      "shippedQuantity": 50,
      "receivedQuantity": null,
      "status": "PENDING"
    }
  ],
  "requestedBy": "John Doe",
  "approvedBy": "Jane Smith",
  "requestDate": "2024-01-14",
  "shippedDate": "2024-01-15",
  "history": [
    {
      "action": "CREATED",
      "performedBy": "John Doe",
      "timestamp": "2024-01-14T09:00:00Z"
    },
    {
      "action": "APPROVED",
      "performedBy": "Jane Smith",
      "timestamp": "2024-01-14T10:30:00Z"
    },
    {
      "action": "SHIPPED",
      "performedBy": "Warehouse Staff",
      "timestamp": "2024-01-15T08:00:00Z"
    }
  ]
}
```

### ReceiveTransferRequest
```json
{
  "items": [
    {
      "itemId": "uuid",
      "receivedQuantity": 48,
      "notes": "2 items damaged in transit"
    }
  ],
  "notes": "Received with minor damage"
}
```

---

## Transfer Workflow

```
[DRAFT] → Submit → [PENDING] → Approve → [APPROVED]
                        ↓
                    Reject → [REJECTED]
                    
[APPROVED] → Ship → [IN_TRANSIT] → Receive → [RECEIVED]
                                       ↓
                            Partial → [PARTIAL]
                            
Any state except RECEIVED → Cancel → [CANCELLED]
```

---

## Acceptance Criteria

- [ ] User can create transfer between warehouses
- [ ] Transfer requires approval (configurable)
- [ ] Stock deducts from source on shipment
- [ ] Stock adds to destination on receipt
- [ ] Partial receiving is supported
- [ ] Shortages are tracked and reported
- [ ] Packing list can be printed
- [ ] Full audit trail is maintained
- [ ] Notifications sent on status changes

---

## Dependencies

- **Requires**: 04-inventory, 02-multi-tenant (warehouses)

## Blocks

- None
