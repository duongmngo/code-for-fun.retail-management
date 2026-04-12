# Promotions & Discounts Module Tasks

## Overview
- **Phase**: 2 - F&B Extensions
- **Timeline**: Week 15-16
- **Status**: Not Started
- **Priority**: P2 (Medium)

---

## Backend Tasks

### Entities & Database

#### Promotion Entity
- [ ] Create Promotion entity:
  - id, tenantId
  - code (nullable, for manual application)
  - name, description
  - promotionType: PERCENTAGE_OFF, FIXED_AMOUNT_OFF, BUY_X_GET_Y, BUNDLE, FREE_ITEM
  - discountValue (percentage or amount)
  - minOrderAmount
  - maxDiscountAmount
  - usageLimit (total)
  - usageLimitPerCustomer
  - currentUsage
  - validFrom, validTo
  - conditions (JSON - complex rules)
  - priority
  - isAutoApply
  - isStackable
  - isActive, createdAt

#### PromotionCondition Entity
- [ ] Create PromotionCondition entity:
  - id, promotionId
  - conditionType: PRODUCT, CATEGORY, CUSTOMER_GROUP, MIN_QTY, DAY_OF_WEEK, TIME_OF_DAY
  - operator: IN, NOT_IN, EQUALS, GREATER_THAN, LESS_THAN
  - values (JSON array)
  - isRequired (AND) or optional (OR)

#### PromotionAction Entity
- [ ] Create PromotionAction entity:
  - id, promotionId
  - actionType: DISCOUNT_PERCENTAGE, DISCOUNT_FIXED, FREE_ITEM, FREE_SHIPPING, BONUS_POINTS
  - value
  - applyTo: ORDER, LINE_ITEM, CHEAPEST_ITEM, MOST_EXPENSIVE_ITEM
  - targetProductId, targetCategoryId

#### PromotionUsage Entity
- [ ] Create PromotionUsage entity:
  - id, promotionId
  - customerId
  - saleId
  - discountAmount
  - usedAt

#### Coupon Entity
- [ ] Create Coupon entity:
  - id, tenantId, promotionId
  - code (unique)
  - usageLimit
  - usedCount
  - validFrom, validTo
  - isActive

- [ ] Write Flyway migrations

### Promotion Service
- [ ] Implement promotion CRUD
- [ ] Implement promotion validation
- [ ] Implement date/time validation
- [ ] Implement condition evaluation
- [ ] Implement usage tracking

### Promotion Engine
- [ ] Evaluate all applicable promotions
- [ ] Check conditions against cart
- [ ] Calculate discount amounts
- [ ] Handle priority/stacking
- [ ] Return applicable discounts

### Coupon Service
- [ ] Validate coupon code
- [ ] Generate coupon codes
- [ ] Bulk coupon generation
- [ ] Track coupon usage

### Buy X Get Y Logic
- [ ] Identify qualifying items
- [ ] Calculate free items
- [ ] Apply to correct line items

### Bundle Pricing
- [ ] Define bundle compositions
- [ ] Calculate bundle price
- [ ] Validate bundle completeness

### Events
- [ ] Subscribe to SaleCompletedEvent
- [ ] Update usage counters
- [ ] Archive expired promotions

### Testing
- [ ] Unit tests for promotion engine
- [ ] Test condition evaluation
- [ ] Test discount calculations
- [ ] Test stacking rules
- [ ] Integration tests

---

## Frontend Tasks

### Promotion Management
- [ ] Create promotions list page (/promotions)
  - Status filters (active, scheduled, expired)
  - Quick actions
- [ ] Create promotion form page
  - Basic info
  - Type selection
  - Condition builder
  - Date range picker
  - Usage limits

### Condition Builder UI
- [ ] Visual condition builder
- [ ] Add/remove conditions
- [ ] AND/OR logic
- [ ] Product selector
- [ ] Category selector
- [ ] Customer group selector

### Coupon Management
- [ ] Coupon list view
- [ ] Generate coupons
- [ ] Bulk generation
- [ ] Download coupon codes

### POS Integration
- [ ] Show auto-applied promotions
- [ ] Manual coupon entry
- [ ] Show discount breakdown
- [ ] Remove promotion option

### Promotion Analytics
- [ ] Usage statistics
- [ ] Revenue impact
- [ ] Top performing promotions
- [ ] Redemption trends

### Testing
- [ ] Test condition builder
- [ ] Test coupon generation
- [ ] Test POS integration
- [ ] E2E test promotion flow

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/promotions | List promotions | Yes |
| POST | /api/v1/promotions | Create promotion | Yes |
| GET | /api/v1/promotions/{id} | Get promotion | Yes |
| PUT | /api/v1/promotions/{id} | Update promotion | Yes |
| DELETE | /api/v1/promotions/{id} | Delete promotion | Yes |
| POST | /api/v1/promotions/apply | Apply to cart | Yes |
| POST | /api/v1/promotions/validate-code | Validate coupon | Yes |
| GET | /api/v1/coupons | List coupons | Yes |
| POST | /api/v1/coupons/generate | Generate coupons | Yes |
| GET | /api/v1/promotions/{id}/analytics | Usage analytics | Yes |

---

## Data Models

### PromotionResponse
```json
{
  "id": "uuid",
  "code": "SUMMER20",
  "name": "Summer Sale 20%",
  "description": "20% off all summer items",
  "promotionType": "PERCENTAGE_OFF",
  "discountValue": 20,
  "minOrderAmount": 200000,
  "maxDiscountAmount": 100000,
  "usageLimit": 1000,
  "currentUsage": 150,
  "validFrom": "2024-06-01",
  "validTo": "2024-08-31",
  "conditions": [
    {
      "type": "CATEGORY",
      "operator": "IN",
      "values": ["uuid-summer-category"],
      "label": "Summer Collection only"
    }
  ],
  "isAutoApply": true,
  "isStackable": false,
  "isActive": true
}
```

### CreatePromotionRequest
```json
{
  "name": "Buy 2 Get 1 Free",
  "description": "Buy any 2 items, get the cheapest one free",
  "promotionType": "BUY_X_GET_Y",
  "conditions": [
    {
      "type": "MIN_QTY",
      "operator": "GREATER_THAN_EQUALS",
      "values": [3]
    }
  ],
  "actions": [
    {
      "type": "FREE_ITEM",
      "applyTo": "CHEAPEST_ITEM",
      "quantity": 1
    }
  ],
  "validFrom": "2024-01-01",
  "validTo": "2024-01-31",
  "isAutoApply": true
}
```

### ApplyPromotionsRequest
```json
{
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid",
      "quantity": 3,
      "unitPrice": 100000
    }
  ],
  "customerId": "uuid",
  "couponCode": "SUMMER20"
}
```

### ApplyPromotionsResponse
```json
{
  "originalTotal": 300000,
  "discountTotal": 50000,
  "finalTotal": 250000,
  "appliedPromotions": [
    {
      "promotionId": "uuid",
      "name": "Summer Sale 20%",
      "discountAmount": 50000,
      "appliedTo": "ORDER"
    }
  ],
  "lineItemDiscounts": [
    {
      "itemIndex": 2,
      "promotionId": "uuid",
      "discountAmount": 100000,
      "reason": "Free item (Buy 2 Get 1)"
    }
  ]
}
```

---

## Promotion Types

| Type | Description | Example |
|------|-------------|---------|
| PERCENTAGE_OFF | % discount | 20% off |
| FIXED_AMOUNT_OFF | Fixed discount | 50,000 VND off |
| BUY_X_GET_Y | Buy X items, get Y free | Buy 2 Get 1 |
| BUNDLE | Special price for combo | Combo A 199k |
| FREE_ITEM | Free specific item | Free drink with meal |
| FREE_SHIPPING | Waive delivery fee | Free delivery over 500k |

---

## Condition Types

| Condition | Description |
|-----------|-------------|
| MIN_ORDER_AMOUNT | Minimum cart value |
| MIN_QUANTITY | Minimum items in cart |
| PRODUCT | Specific products required |
| CATEGORY | Products from category |
| CUSTOMER_GROUP | Customer type |
| DAY_OF_WEEK | Specific days |
| TIME_OF_DAY | Happy hour |
| FIRST_ORDER | New customers only |
| NTH_ORDER | Every Nth order |

---

## Acceptance Criteria

- [ ] Promotions can be created with various types
- [ ] Conditions can be combined with AND/OR
- [ ] Auto-apply promotions apply at checkout
- [ ] Coupon codes can be entered manually
- [ ] Usage limits are enforced
- [ ] Date ranges are validated
- [ ] Buy X Get Y calculates correctly
- [ ] Stacking rules are respected
- [ ] POS shows all applied discounts
- [ ] Analytics track promotion performance

---

## Dependencies

- **Requires**: 03-product, 05-pos, 12-customer

## Blocks

- None
