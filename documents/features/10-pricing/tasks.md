# Advanced Pricing Module Tasks

## Overview
- **Phase**: 2 - F&B Extensions
- **Timeline**: Week 13-14
- **Status**: Not Started
- **Priority**: P2 (Medium)

---

## Backend Tasks

### Entities & Database

#### PriceList Entity
- [ ] Create PriceList entity:
  - id, tenantId
  - name (e.g., "Retail Prices", "Wholesale Prices", "VIP Prices")
  - description
  - currency
  - isDefault
  - priority (for overlapping rules)
  - validFrom, validTo
  - isActive, createdAt, updatedAt

#### PriceListItem Entity
- [ ] Create PriceListItem entity:
  - id, priceListId
  - productId, variantId
  - price
  - minQuantity (for quantity breaks)
  - maxQuantity

#### CustomerPriceGroup Entity
- [ ] Create CustomerPriceGroup entity:
  - id, tenantId
  - name (e.g., "Retail", "Wholesale", "Distributor")
  - defaultPriceListId
  - discountPercent (optional overall discount)

#### TimeBasedPricing Entity
- [ ] Create TimeBasedPricing entity:
  - id, tenantId
  - name (e.g., "Happy Hour")
  - priceListId
  - dayOfWeek (0-6 or ALL)
  - startTime, endTime
  - validFrom, validTo
  - isActive

#### BranchPricing Entity
- [ ] Create BranchPricing entity:
  - id, tenantId
  - branchId
  - productId, variantId
  - price (override base price)
  - reason (e.g., "Airport markup")

- [ ] Write Flyway migrations

### Price Resolution Service
- [ ] Implement price resolution algorithm:
  1. Check branch-specific price
  2. Check time-based pricing
  3. Check customer price group
  4. Check quantity breaks
  5. Check default price list
  6. Fall back to product base price
- [ ] Cache resolved prices
- [ ] Invalidate cache on updates

### Price List Service
- [ ] Implement price list CRUD
- [ ] Implement bulk price updates
- [ ] Import prices from CSV
- [ ] Export prices to CSV
- [ ] Clone price list

### Quantity Breaks
- [ ] Define quantity break tiers
- [ ] Apply during price calculation
- [ ] Display quantity breaks in POS

### Time-Based Pricing
- [ ] Define time-based rules
- [ ] Auto-apply based on current time
- [ ] Display active promotions

### Branch Pricing
- [ ] Override prices per branch
- [ ] Bulk branch price adjustment

### Testing
- [ ] Unit tests for price resolution
- [ ] Test priority ordering
- [ ] Test time-based rules
- [ ] Test quantity breaks
- [ ] Integration tests

---

## Frontend Tasks

### Price List Management
- [ ] Create price lists page (/pricing)
- [ ] Create price list form
- [ ] Create price list items editor
  - Product search
  - Bulk price entry
  - Import/Export
- [ ] Price list comparison view

### Customer Price Groups
- [ ] Create groups management
- [ ] Assign customers to groups
- [ ] Assign price list to group

### Time-Based Pricing UI
- [ ] Create time rules page
- [ ] Visual schedule editor
- [ ] Preview active rules

### Branch Pricing UI
- [ ] Branch price overrides page
- [ ] Bulk edit by branch

### POS Integration
- [ ] Show applicable prices
- [ ] Show quantity discounts
- [ ] Apply customer pricing
- [ ] Show time-based promotions

### Testing
- [ ] Test price list editor
- [ ] Test bulk imports
- [ ] Test POS pricing

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/pricing/price-lists | List price lists | Yes |
| POST | /api/v1/pricing/price-lists | Create price list | Yes |
| PUT | /api/v1/pricing/price-lists/{id} | Update price list | Yes |
| PUT | /api/v1/pricing/price-lists/{id}/items | Update items | Yes |
| POST | /api/v1/pricing/price-lists/{id}/import | Import CSV | Yes |
| GET | /api/v1/pricing/resolve | Resolve price | Yes |
| GET | /api/v1/pricing/customer-groups | List groups | Yes |
| POST | /api/v1/pricing/customer-groups | Create group | Yes |
| GET | /api/v1/pricing/time-rules | List time rules | Yes |
| POST | /api/v1/pricing/time-rules | Create time rule | Yes |
| GET | /api/v1/pricing/branch/{id} | Branch prices | Yes |
| PUT | /api/v1/pricing/branch/{id} | Update branch prices | Yes |

---

## Data Models

### PriceResolutionRequest
```json
{
  "productId": "uuid",
  "variantId": "uuid",
  "quantity": 10,
  "customerId": "uuid",
  "branchId": "uuid",
  "timestamp": "2024-01-15T17:30:00Z"
}
```

### PriceResolutionResponse
```json
{
  "variantId": "uuid",
  "basePrice": 100000,
  "resolvedPrice": 85000,
  "appliedRules": [
    {
      "type": "TIME_BASED",
      "name": "Happy Hour",
      "effect": "-10%"
    },
    {
      "type": "QUANTITY_BREAK",
      "name": "Buy 10+",
      "effect": "-5%"
    }
  ],
  "quantityBreaks": [
    { "minQty": 1, "price": 100000 },
    { "minQty": 10, "price": 95000 },
    { "minQty": 50, "price": 90000 }
  ]
}
```

---

## Acceptance Criteria

- [ ] Multiple price lists can be created
- [ ] Prices resolve correctly by priority
- [ ] Time-based pricing activates automatically
- [ ] Quantity breaks apply in POS
- [ ] Customer groups get assigned prices
- [ ] Branch-specific pricing works
- [ ] Prices can be imported/exported
- [ ] POS shows applied pricing rules

---

## Dependencies

- **Requires**: 03-product, 05-pos, 12-customer

## Blocks

- 14-promotions (uses pricing engine)
