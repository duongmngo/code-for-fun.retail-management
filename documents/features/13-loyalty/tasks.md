# Loyalty Program Module Tasks

## Overview
- **Phase**: 2 - F&B Extensions
- **Timeline**: Week 14-15
- **Status**: Not Started
- **Priority**: P2 (Medium)

---

## Backend Tasks

### Entities & Database

#### LoyaltyProgram Entity
- [ ] Create LoyaltyProgram entity:
  - id, tenantId
  - name, description
  - pointsPerCurrencyUnit (e.g., 1 point per 10,000 VND)
  - pointsExpirationDays (0 = never expire)
  - minRedeemPoints
  - maxRedeemPercent (max % of order redeemable)
  - pointsValue (value per point in currency)
  - isActive

#### LoyaltyTier Entity
- [ ] Create LoyaltyTier entity:
  - id, programId
  - name (Bronze, Silver, Gold, Platinum)
  - minPoints (threshold to reach tier)
  - pointsMultiplier (bonus earning, e.g., 1.5x)
  - benefits (JSON)
  - displayOrder

#### CustomerLoyalty Entity
- [ ] Create CustomerLoyalty entity:
  - id, customerId, programId
  - currentPoints
  - lifetimePoints
  - currentTierId
  - tierExpiresAt
  - enrolledAt

#### LoyaltyTransaction Entity
- [ ] Create LoyaltyTransaction entity:
  - id, customerLoyaltyId
  - transactionType: EARN, REDEEM, EXPIRE, ADJUST, BONUS
  - points (positive for earn, negative for redeem)
  - balanceAfter
  - referenceType (SALE, MANUAL, PROMO)
  - referenceId
  - description
  - expiresAt
  - createdAt

- [ ] Write Flyway migrations

### Loyalty Program Service
- [ ] Implement program CRUD
- [ ] Implement tier configuration
- [ ] Calculate points earning rules
- [ ] Calculate tier progression

### Points Management Service
- [ ] Earn points on purchase
- [ ] Apply tier multipliers
- [ ] Redeem points in checkout
- [ ] Validate redemption rules
- [ ] Handle partial redemption
- [ ] Calculate points balance

### Point Expiration Service
- [ ] Track point expiration dates
- [ ] Run expiration job (nightly)
- [ ] Notify before expiration
- [ ] Process expired points

### Tier Management
- [ ] Evaluate tier status
- [ ] Promote customers to tier
- [ ] Demote on tier expiration
- [ ] Apply tier benefits

### Events
- [ ] Subscribe to SaleCompletedEvent
- [ ] Publish PointsEarnedEvent
- [ ] Publish TierChangedEvent
- [ ] Publish PointsExpiringEvent

### Reporting
- [ ] Points liability report
- [ ] Active members report
- [ ] Redemption rate report
- [ ] Tier distribution report

### Testing
- [ ] Unit tests for points calculation
- [ ] Test tier progression
- [ ] Test point expiration
- [ ] Test redemption flow
- [ ] Integration tests

---

## Frontend Tasks

### Loyalty Program Setup
- [ ] Create loyalty settings page (/settings/loyalty)
- [ ] Program configuration form
- [ ] Tier configuration
  - Add/edit tiers
  - Set thresholds
  - Configure multipliers

### Customer Loyalty View
- [ ] Loyalty info on customer detail
- [ ] Points balance
- [ ] Current tier
- [ ] Points history
- [ ] Progress to next tier

### POS Integration
- [ ] Show loyalty info during checkout
- [ ] Points to be earned
- [ ] Available points to redeem
- [ ] Redeem points modal
- [ ] Apply points as payment

### Loyalty Cards
- [ ] Digital loyalty card
- [ ] QR code for member
- [ ] Card scan/lookup

### Notifications
- [ ] Points earned notification
- [ ] Tier upgrade notification
- [ ] Points expiring warning
- [ ] Welcome bonus notification

### Member Portal
- [ ] View points balance
- [ ] View tier status
- [ ] Points history
- [ ] Rewards catalog (future)

### Testing
- [ ] Test loyalty configuration
- [ ] Test POS redemption
- [ ] Test tier UI
- [ ] E2E test loyalty flow

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/loyalty/program | Get program config | Yes |
| PUT | /api/v1/loyalty/program | Update program | Yes |
| GET | /api/v1/loyalty/tiers | Get tiers | Yes |
| PUT | /api/v1/loyalty/tiers | Update tiers | Yes |
| GET | /api/v1/customers/{id}/loyalty | Get customer loyalty | Yes |
| POST | /api/v1/customers/{id}/loyalty/enroll | Enroll customer | Yes |
| GET | /api/v1/customers/{id}/loyalty/transactions | Point history | Yes |
| POST | /api/v1/loyalty/earn | Earn points | Yes |
| POST | /api/v1/loyalty/redeem | Redeem points | Yes |
| POST | /api/v1/loyalty/adjust | Manual adjust | Yes |
| GET | /api/v1/loyalty/reports/liability | Points liability | Yes |

---

## Data Models

### LoyaltyProgramResponse
```json
{
  "id": "uuid",
  "name": "Rewards Club",
  "pointsPerCurrencyUnit": 10000,
  "pointsExpirationDays": 365,
  "minRedeemPoints": 100,
  "maxRedeemPercent": 50,
  "pointsValue": 1000,
  "tiers": [
    {
      "name": "Bronze",
      "minPoints": 0,
      "pointsMultiplier": 1.0,
      "benefits": ["Free gift wrapping"]
    },
    {
      "name": "Silver",
      "minPoints": 500,
      "pointsMultiplier": 1.25,
      "benefits": ["Free gift wrapping", "Birthday discount"]
    },
    {
      "name": "Gold",
      "minPoints": 2000,
      "pointsMultiplier": 1.5,
      "benefits": ["All Silver benefits", "Free shipping"]
    }
  ]
}
```

### CustomerLoyaltyResponse
```json
{
  "customerId": "uuid",
  "currentPoints": 750,
  "lifetimePoints": 1500,
  "tier": {
    "name": "Silver",
    "multiplier": 1.25
  },
  "nextTier": {
    "name": "Gold",
    "pointsRequired": 1250
  },
  "expiringPoints": {
    "amount": 200,
    "expiresAt": "2024-03-31"
  },
  "enrolledAt": "2023-01-01"
}
```

### EarnPointsRequest
```json
{
  "customerId": "uuid",
  "saleId": "uuid",
  "saleAmount": 500000
}
```

### RedeemPointsRequest
```json
{
  "customerId": "uuid",
  "saleId": "uuid",
  "pointsToRedeem": 500
}
```

---

## Points Calculation

### Earning Points
```
basePoints = saleAmount / pointsPerCurrencyUnit
tierMultiplier = customer.tier.pointsMultiplier
finalPoints = floor(basePoints * tierMultiplier)

Example:
- Sale: 500,000 VND
- Rate: 1 point per 10,000 VND
- Tier Multiplier: 1.25 (Silver)
- Points Earned: floor(50 * 1.25) = 62 points
```

### Redeeming Points
```
redeemValue = points * pointsValue
maxRedeem = saleAmount * maxRedeemPercent

Example:
- Points to Redeem: 500
- Point Value: 1,000 VND
- Redeem Value: 500,000 VND
- If sale is 800,000 and max 50%: capped at 400,000
```

---

## Acceptance Criteria

- [ ] Loyalty program can be configured
- [ ] Tiers can be set up with thresholds
- [ ] Points earn on purchases automatically
- [ ] Tier multipliers apply correctly
- [ ] Points can be redeemed at checkout
- [ ] Redemption respects max percentage
- [ ] Points expire after configured period
- [ ] Customers are notified of expiring points
- [ ] Tier upgrades happen automatically
- [ ] Loyalty info visible in customer profile
- [ ] POS shows loyalty status during sale

---

## Dependencies

- **Requires**: 12-customer, 05-pos

## Blocks

- None
