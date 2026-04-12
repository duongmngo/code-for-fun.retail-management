# Inventory Management Module Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 5-7
- **Status**: Not Started
- **Priority**: P0 (Critical)

---

## Backend Tasks

### Entities & Database

#### Stock Entity
- [ ] Create Stock entity:
  - id
  - variantId (FK) or productId (for non-variant products)
  - warehouseId (FK)
  - quantity (available)
  - reservedQuantity (for pending orders)
  - minStockLevel (low stock threshold)
  - maxStockLevel (max capacity)
  - lastCountedAt
  - UNIQUE(variantId, warehouseId)

#### Stock Movement Entity
- [ ] Create StockMovement entity (immutable log):
  - id, stockId
  - movementType: PURCHASE_IN, SALE_OUT, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT, RETURN_IN, DAMAGE_OUT
  - quantity (positive/negative based on direction)
  - previousQuantity, newQuantity
  - reason (text)
  - referenceType (PURCHASE_ORDER, SALE, TRANSFER, ADJUSTMENT)
  - referenceId
  - performedBy (userId)
  - createdAt

#### Stock Adjustment Entity
- [ ] Create StockAdjustment entity:
  - id, warehouseId
  - adjustmentNumber (auto-generated)
  - adjustmentDate
  - status: DRAFT, APPROVED, REJECTED
  - reason
  - notes
  - createdBy, approvedBy, rejectedBy
  - createdAt, approvedAt, rejectedAt

#### Stock Adjustment Item
- [ ] Create StockAdjustmentItem entity:
  - id, adjustmentId
  - variantId (or productId)
  - expectedQuantity
  - actualQuantity
  - difference (actualQuantity - expectedQuantity)

- [ ] Write Flyway migrations for all tables
- [ ] Add indexes for stock lookups and reporting

### Stock Service
- [ ] Implement real-time stock query by warehouse
- [ ] Implement multi-warehouse stock aggregation
- [ ] Implement low stock detection
- [ ] Implement out-of-stock detection
- [ ] Implement stock valuation calculation

### Stock Movement Operations
- [ ] Implement recordSale (decrease stock + create movement)
- [ ] Implement recordAdjustment (update stock + create movement)
- [ ] Implement recordTransfer (out from source, in to destination)
- [ ] Implement recordPurchase (increase stock)
- [ ] Implement stock reservation for pending orders
- [ ] Implement stock release for cancelled orders

### Stock Adjustment Service
- [ ] Implement adjustment draft creation
- [ ] Implement item addition to adjustment
- [ ] Implement adjustment approval workflow
- [ ] Implement adjustment rejection
- [ ] Bulk apply approved adjustments

### Stock Count (Inventory Count)
- [ ] Implement inventory count initiation
- [ ] Implement partial count (by category/location)
- [ ] Implement full count
- [ ] Generate count sheets
- [ ] Record count results
- [ ] Auto-create adjustments from count

### Stock Reports
- [ ] Stock on hand report (by warehouse)
- [ ] Stock movement history report
- [ ] Low stock alert report
- [ ] Stock valuation report
- [ ] Stock turnover report

### Events & Notifications
- [ ] Publish LowStockEvent when below threshold
- [ ] Publish OutOfStockEvent when zero
- [ ] Subscribe to SaleCompletedEvent to decrease stock
- [ ] Subscribe to SaleCancelledEvent to restore stock

### Caching
- [ ] Cache stock levels in Redis
- [ ] Real-time stock level updates
- [ ] Cache invalidation on movement

### Testing
- [ ] Unit tests for StockService
- [ ] Unit tests for movement calculations
- [ ] Integration tests for stock operations
- [ ] Test concurrent stock updates
- [ ] Test stock reservation flow

---

## Frontend Tasks

### Stock Management Pages
- [ ] Create stock overview page (/inventory)
  - Stock levels by warehouse
  - Low stock alerts
  - Quick filters
- [ ] Create stock detail page (/inventory/{variantId})
  - Stock across all warehouses
  - Movement history
- [ ] Create warehouse stock page (/warehouses/{id}/stock)

### Stock Adjustment UI
- [ ] Create adjustment list page (/inventory/adjustments)
- [ ] Create adjustment form page
  - Search and add products
  - Enter expected vs actual
  - Auto-calculate difference
- [ ] Create adjustment review/approval page
- [ ] Show adjustment history

### Stock Count UI
- [ ] Create count initiation page
- [ ] Create count sheets (printable)
- [ ] Create count entry page
  - Barcode scanning
  - Quick quantity entry
- [ ] Create count result summary
- [ ] Create adjustment generation confirm

### Stock Reports UI
- [ ] Create stock on hand report
  - Filters: warehouse, category, status
  - Export to Excel/PDF
- [ ] Create stock movement report
- [ ] Create low stock dashboard section

### Real-time Updates
- [ ] WebSocket connection for stock updates
- [ ] Real-time stock badge updates
- [ ] Low stock notifications

### Offline Support
- [ ] Store stock levels in IndexedDB
- [ ] Queue stock adjustments offline
- [ ] Sync on reconnect
- [ ] Handle conflict resolution

### Testing
- [ ] Write tests for StockTable component
- [ ] Write tests for AdjustmentForm
- [ ] Write tests for CountEntry component
- [ ] E2E test for adjustment flow

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/stock | List stock levels | Yes |
| GET | /api/v1/stock/product/{id} | Stock by product | Yes |
| GET | /api/v1/stock/variant/{id} | Stock by variant | Yes |
| GET | /api/v1/stock/warehouse/{id} | Stock by warehouse | Yes |
| GET | /api/v1/stock/low | Low stock items | Yes |
| GET | /api/v1/stock/movements | Movement history | Yes |
| POST | /api/v1/stock/adjustments | Create adjustment | Yes |
| GET | /api/v1/stock/adjustments/{id} | Get adjustment | Yes |
| POST | /api/v1/stock/adjustments/{id}/items | Add items | Yes |
| POST | /api/v1/stock/adjustments/{id}/approve | Approve | Yes |
| POST | /api/v1/stock/adjustments/{id}/reject | Reject | Yes |
| POST | /api/v1/stock/counts | Initiate count | Yes |
| PUT | /api/v1/stock/counts/{id} | Update count results | Yes |

---

## Data Models

### StockResponse
```json
{
  "variantId": "uuid",
  "productName": "Summer Dress - Red - S",
  "sku": "DRESS-001-RED-S",
  "warehouses": [
    {
      "warehouseId": "uuid",
      "warehouseName": "Main Warehouse",
      "quantity": 50,
      "reservedQuantity": 5,
      "availableQuantity": 45,
      "minStockLevel": 10,
      "status": "IN_STOCK"
    }
  ],
  "totalQuantity": 100,
  "totalAvailable": 90
}
```

### CreateAdjustmentRequest
```json
{
  "warehouseId": "uuid",
  "reason": "Monthly inventory count",
  "notes": "Counted by staff on 2024-01-15",
  "items": [
    {
      "variantId": "uuid",
      "expectedQuantity": 50,
      "actualQuantity": 48
    }
  ]
}
```

### StockMovementResponse
```json
{
  "id": "uuid",
  "productName": "Summer Dress - Red - S",
  "movementType": "SALE_OUT",
  "quantity": -2,
  "previousQuantity": 50,
  "newQuantity": 48,
  "reason": "Sale #123",
  "performedBy": "John",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## Acceptance Criteria

- [ ] Stock levels accurately reflect all movements
- [ ] Low stock alerts appear when below threshold
- [ ] User can create and approve stock adjustments
- [ ] Stock movements are logged immutably
- [ ] Multi-warehouse stock aggregation works
- [ ] Stock counts can be performed and generate adjustments
- [ ] Reports show accurate stock data
- [ ] Concurrent sales don't cause stock inconsistencies
- [ ] Stock updates in real-time across devices

---

## Dependencies

- **Requires**: 03-product, 02-multi-tenant (warehouses)

## Blocks

- 05-pos (needs stock validation)
- 09-transfer-orders (needs stock)
