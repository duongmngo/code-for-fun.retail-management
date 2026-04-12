# Material Management Module Tasks

## Overview
- **Phase**: 2 - F&B Extensions
- **Timeline**: Week 11-13
- **Status**: Not Started
- **Priority**: P2 (Medium)

---

## Backend Tasks

### Entities & Database

#### Material Entity
- [ ] Create Material entity:
  - id, tenantId
  - name, description
  - sku (unique per tenant)
  - unit (kg, g, ml, L, pcs, etc.)
  - unitCost
  - categoryId (FK)
  - minStockLevel
  - isActive, createdAt, updatedAt

#### MaterialCategory Entity
- [ ] Create MaterialCategory entity:
  - id, tenantId
  - name, description
  - parentId (hierarchical)
  - displayOrder

#### MaterialStock Entity
- [ ] Create MaterialStock entity:
  - id, materialId
  - warehouseId
  - quantity
  - lastCostPrice
  - expiryDate (nullable)
  - batchNumber (nullable)
  - UNIQUE(materialId, warehouseId, batchNumber)

#### Recipe Entity
- [ ] Create Recipe entity:
  - id, tenantId
  - productId (FK - the menu item)
  - variantId (nullable - specific variant)
  - name (e.g., "Iced Latte - Medium")
  - yield (portions produced)
  - isActive

#### RecipeIngredient Entity
- [ ] Create RecipeIngredient entity:
  - id, recipeId
  - materialId
  - quantity
  - unit
  - wastagePercent (optional)

#### PurchaseOrder Entity
- [ ] Create PurchaseOrder entity:
  - id, tenantId
  - poNumber (auto-generated)
  - supplierId
  - warehouseId
  - status: DRAFT, SUBMITTED, RECEIVED, CANCELLED
  - orderDate, expectedDate, receivedDate
  - totalAmount
  - notes, createdBy

#### PurchaseOrderItem Entity
- [ ] Create PurchaseOrderItem entity:
  - id, purchaseOrderId
  - materialId
  - orderedQuantity
  - receivedQuantity
  - unitCost
  - totalCost

#### Supplier Entity
- [ ] Create Supplier entity:
  - id, tenantId
  - name, contactPerson
  - phone, email, address
  - paymentTerms
  - isActive

- [ ] Write Flyway migrations

### Material Service
- [ ] Implement material CRUD
- [ ] Implement material search
- [ ] Implement material category management
- [ ] Track material stock levels
- [ ] Handle batch/expiry tracking

### Recipe Service
- [ ] Implement recipe CRUD
- [ ] Link recipes to products
- [ ] Calculate recipe cost from materials
- [ ] Validate material availability
- [ ] Clone/duplicate recipes

### Production Service (Recipe Execution)
- [ ] Produce batch from recipe
- [ ] Deduct materials from stock
- [ ] Track production batches
- [ ] Handle partial production

### Inventory Consumption
- [ ] Auto-deduct materials on sale (if recipes linked)
- [ ] Manual consumption recording
- [ ] Wastage recording
- [ ] Stock transfer for materials

### Purchase Order Service
- [ ] Implement PO CRUD
- [ ] Implement PO workflow (draft → submit → receive)
- [ ] Partial receiving
- [ ] Update stock on receive
- [ ] Update material cost (weighted average)

### Supplier Service
- [ ] Implement supplier CRUD
- [ ] Track purchase history by supplier

### Material Reports
- [ ] Material consumption report
- [ ] Recipe cost report
- [ ] Material waste report
- [ ] Low material stock report
- [ ] Purchase order history

### Testing
- [ ] Unit tests for RecipeService
- [ ] Unit tests for consumption calculations
- [ ] Integration tests for PO workflow
- [ ] Test cost calculations

---

## Frontend Tasks

### Material Management
- [ ] Create materials list page (/materials)
- [ ] Create material form page
- [ ] Create material category page
- [ ] Create material stock view

### Recipe Management
- [ ] Create recipes list page (/recipes)
- [ ] Create recipe builder page
  - Select product
  - Add ingredients
  - Specify quantities
  - Calculate cost
- [ ] Show recipe cost analysis
- [ ] Recipe duplication

### Production
- [ ] Create production page (/production)
- [ ] Create production batch form
- [ ] Show material requirements
- [ ] Confirm material deduction
- [ ] Production history

### Purchase Orders
- [ ] Create PO list page (/purchase-orders)
- [ ] Create PO form page
  - Select supplier
  - Add items
  - Set quantities
- [ ] PO detail page
- [ ] Receive goods form
- [ ] Print PO

### Suppliers
- [ ] Create supplier list page
- [ ] Create supplier form
- [ ] Supplier purchase history

### Reports UI
- [ ] Material consumption report
- [ ] Recipe cost report
- [ ] PO summary report

### Testing
- [ ] Test recipe builder
- [ ] Test PO workflow
- [ ] E2E test production flow

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/materials | List materials | Yes |
| POST | /api/v1/materials | Create material | Yes |
| PUT | /api/v1/materials/{id} | Update material | Yes |
| DELETE | /api/v1/materials/{id} | Delete material | Yes |
| GET | /api/v1/recipes | List recipes | Yes |
| POST | /api/v1/recipes | Create recipe | Yes |
| PUT | /api/v1/recipes/{id} | Update recipe | Yes |
| GET | /api/v1/recipes/{id}/cost | Calculate cost | Yes |
| POST | /api/v1/production | Create production batch | Yes |
| GET | /api/v1/purchase-orders | List POs | Yes |
| POST | /api/v1/purchase-orders | Create PO | Yes |
| POST | /api/v1/purchase-orders/{id}/receive | Receive goods | Yes |
| GET | /api/v1/suppliers | List suppliers | Yes |
| POST | /api/v1/suppliers | Create supplier | Yes |

---

## Data Models

### RecipeResponse
```json
{
  "id": "uuid",
  "productId": "uuid",
  "productName": "Iced Latte",
  "variantName": "Medium",
  "yield": 1,
  "ingredients": [
    {
      "materialId": "uuid",
      "materialName": "Espresso Coffee",
      "quantity": 20,
      "unit": "g",
      "unitCost": 500,
      "lineCost": 10000
    },
    {
      "materialId": "uuid",
      "materialName": "Fresh Milk",
      "quantity": 200,
      "unit": "ml",
      "unitCost": 30,
      "lineCost": 6000
    }
  ],
  "totalCost": 16000,
  "productPrice": 45000,
  "profitMargin": 64.4
}
```

### CreatePurchaseOrderRequest
```json
{
  "supplierId": "uuid",
  "warehouseId": "uuid",
  "expectedDate": "2024-01-20",
  "items": [
    {
      "materialId": "uuid",
      "quantity": 10,
      "unit": "kg",
      "unitCost": 100000
    }
  ],
  "notes": "Weekly coffee beans order"
}
```

---

## Acceptance Criteria

- [ ] Materials can be managed with categories
- [ ] Recipes link products to materials
- [ ] Recipe cost calculates accurately
- [ ] Materials deduct on production/sale
- [ ] Purchase orders manage material procurement
- [ ] Receiving updates stock and costs
- [ ] Reports show material usage and costs
- [ ] Low material stock triggers alerts

---

## Dependencies

- **Requires**: 03-product (for recipes), 04-inventory (stock management)

## Blocks

- None
