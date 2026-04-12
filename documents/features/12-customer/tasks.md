# Customer Management Module Tasks

## Overview
- **Phase**: 2 - F&B Extensions
- **Timeline**: Week 12-13
- **Status**: Not Started
- **Priority**: P2 (Medium)

---

## Backend Tasks

### Entities & Database

#### Customer Entity
- [ ] Create Customer entity:
  - id, tenantId
  - code (auto-generated, tenant-scoped)
  - firstName, lastName, fullName
  - email, phone (at least one required)
  - dateOfBirth
  - gender
  - customerGroupId (FK)
  - addresses (JSON array)
  - notes
  - tags
  - source: WALK_IN, ONLINE, REFERRAL, IMPORT
  - isActive, createdAt, updatedAt

#### CustomerAddress Entity
- [ ] Create CustomerAddress entity:
  - id, customerId
  - label (Home, Work, etc.)
  - addressLine1, addressLine2
  - city, district, ward
  - postalCode
  - country
  - isDefault

#### CustomerGroup Entity
- [ ] Create CustomerGroup entity:
  - id, tenantId
  - name (e.g., "Regular", "VIP", "Wholesale")
  - description
  - priceGroupId (FK to CustomerPriceGroup)
  - discountPercent
  - benefits (JSON)
  - autoAssignment (rules for auto-grouping)

#### CustomerActivity Entity
- [ ] Create CustomerActivity entity:
  - id, customerId
  - activityType: PURCHASE, RETURN, NOTE, GROUP_CHANGE
  - referenceType, referenceId
  - description
  - performedBy
  - createdAt

- [ ] Write Flyway migrations
- [ ] Add indexes for search

### Customer Service
- [ ] Implement customer CRUD
- [ ] Implement customer search
  - By name, phone, email
  - Fuzzy matching
- [ ] Implement customer merge (deduplicate)
- [ ] Track customer metrics (lifetime value, etc.)

### Customer Group Service
- [ ] Implement group CRUD
- [ ] Assign customers to groups
- [ ] Auto-assignment based on rules
- [ ] Apply group benefits

### Customer Search
- [ ] Full-text search on name, phone, email
- [ ] Phone number normalization
- [ ] Recently accessed customers
- [ ] Advanced filters

### Customer Analytics
- [ ] Calculate lifetime value (LTV)
- [ ] Purchase history
- [ ] Purchase frequency
- [ ] Average order value
- [ ] Last purchase date
- [ ] Product preferences

### Import/Export
- [ ] Import customers from CSV
- [ ] Export customers to CSV
- [ ] Handle duplicates on import

### Events
- [ ] Publish CustomerCreatedEvent
- [ ] Track purchases to update metrics

### Testing
- [ ] Unit tests for CustomerService
- [ ] Test customer search
- [ ] Test group assignment
- [ ] Integration tests

---

## Frontend Tasks

### Customer Pages
- [ ] Create customers list page (/customers)
  - Search with filters
  - Group filter
  - Quick actions
- [ ] Create customer detail page (/customers/{id})
  - Profile info
  - Purchase history
  - Activity timeline
  - Analytics
- [ ] Create customer form page (/customers/new, /customers/{id}/edit)

### Customer Form Components
- [ ] Create CustomerForm component
- [ ] Create AddressManager component
- [ ] Create GroupSelector component
- [ ] Create TagInput component
- [ ] Phone number validation

### Customer Search
- [ ] Create CustomerQuickSearch component
- [ ] Search modal in POS
- [ ] Recent customers list
- [ ] Create customer inline

### Customer Groups
- [ ] Create groups page (/customers/groups)
- [ ] Create group form
- [ ] Bulk group assignment

### POS Integration
- [ ] Quick customer search in checkout
- [ ] Create customer during sale
- [ ] Show customer info & benefits
- [ ] Apply customer pricing

### Analytics Dashboard
- [ ] Customer lifetime value chart
- [ ] Purchase frequency
- [ ] Top customers
- [ ] Growth trends

### Import/Export UI
- [ ] Import wizard
- [ ] Export dialog
- [ ] Duplicate handling

### Offline Support
- [ ] Cache customer data
- [ ] Sync customer changes
- [ ] Queue new customers offline

### Testing
- [ ] Test CustomerForm
- [ ] Test search component
- [ ] Test POS integration
- [ ] E2E test customer flow

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/customers | List customers | Yes |
| POST | /api/v1/customers | Create customer | Yes |
| GET | /api/v1/customers/{id} | Get customer | Yes |
| PUT | /api/v1/customers/{id} | Update customer | Yes |
| DELETE | /api/v1/customers/{id} | Delete customer | Yes |
| GET | /api/v1/customers/search | Search customers | Yes |
| GET | /api/v1/customers/{id}/purchases | Purchase history | Yes |
| GET | /api/v1/customers/{id}/analytics | Customer analytics | Yes |
| POST | /api/v1/customers/{id}/merge | Merge duplicates | Yes |
| POST | /api/v1/customers/import | Import CSV | Yes |
| GET | /api/v1/customers/export | Export CSV | Yes |
| GET | /api/v1/customer-groups | List groups | Yes |
| POST | /api/v1/customer-groups | Create group | Yes |
| PUT | /api/v1/customer-groups/{id} | Update group | Yes |
| POST | /api/v1/customer-groups/{id}/assign | Assign customers | Yes |

---

## Data Models

### CustomerResponse
```json
{
  "id": "uuid",
  "code": "CUST-00001",
  "fullName": "Nguyen Van A",
  "firstName": "A",
  "lastName": "Nguyen Van",
  "email": "a.nguyen@email.com",
  "phone": "+84901234567",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "group": {
    "id": "uuid",
    "name": "VIP"
  },
  "tags": ["frequent", "wholesale"],
  "analytics": {
    "lifetimeValue": 50000000,
    "totalOrders": 25,
    "averageOrderValue": 2000000,
    "lastPurchase": "2024-01-10"
  },
  "addresses": [
    {
      "label": "Home",
      "addressLine1": "123 Main St",
      "city": "Ho Chi Minh",
      "isDefault": true
    }
  ]
}
```

### CreateCustomerRequest
```json
{
  "firstName": "A",
  "lastName": "Nguyen Van",
  "email": "a.nguyen@email.com",
  "phone": "+84901234567",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "groupId": "uuid",
  "tags": ["frequent"],
  "addresses": [
    {
      "label": "Home",
      "addressLine1": "123 Main St",
      "city": "Ho Chi Minh",
      "isDefault": true
    }
  ]
}
```

### CustomerAnalytics
```json
{
  "customerId": "uuid",
  "lifetimeValue": 50000000,
  "totalOrders": 25,
  "averageOrderValue": 2000000,
  "purchaseFrequency": "WEEKLY",
  "daysSinceLastPurchase": 5,
  "topCategories": ["Dresses", "Accessories"],
  "topProducts": [
    { "id": "uuid", "name": "Summer Dress", "purchases": 5 }
  ],
  "monthlySpending": [
    { "month": "2024-01", "amount": 5000000 }
  ]
}
```

---

## Acceptance Criteria

- [ ] Customers can be created with required info
- [ ] Phone/email validation works
- [ ] Customer search is fast and accurate
- [ ] Purchase history is displayed correctly
- [ ] Customer analytics calculate accurately
- [ ] Groups assign correct pricing
- [ ] Customers can be imported from CSV
- [ ] Duplicates can be merged
- [ ] Customer data syncs offline
- [ ] POS shows customer benefits during checkout

---

## Dependencies

- **Requires**: 05-pos (for linking sales)

## Blocks

- 13-loyalty (needs customers)
- 10-pricing (customer price groups)
