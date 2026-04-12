# Product Catalog Module Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 4-6
- **Status**: Not Started
- **Priority**: P0 (Critical)

---

## Backend Tasks

### Entities & Database

#### Product Entity
- [ ] Create Product entity:
  - id, tenantId, name, description
  - sku (unique per tenant)
  - basePrice, baseCost
  - hasVariants (boolean)
  - categoryId (FK)
  - tags (JSON array)
  - images (JSON array of URLs)
  - isActive, createdAt, updatedAt
  
#### Category Entity
- [ ] Create Category entity (hierarchical):
  - id, tenantId, name, description
  - parentId (self-reference for hierarchy)
  - imageUrl
  - displayOrder
  - isActive

#### Variant System
- [ ] Create ProductOption entity:
  - id, productId, name (e.g., "Color", "Size")
  - displayOrder
- [ ] Create OptionValue entity:
  - id, optionId, value (e.g., "Red", "XL")
  - colorCode (optional, for color swatches)
  - displayOrder
- [ ] Create ProductVariant entity:
  - id, productId, sku (unique)
  - barcode (unique, nullable)
  - price (override, nullable = use base)
  - cost (override, nullable = use base)
  - imageUrl (optional)
  - isActive
- [ ] Create VariantOptionValue junction table:
  - variantId, optionValueId

#### Barcode Support
- [ ] Create ProductBarcode entity (multiple barcodes per variant):
  - id, variantId (or productId if no variants)
  - barcode (unique)
  - barcodeType (EAN13, EAN8, UPC, CODE128, etc.)
  - isPrimary

- [ ] Write Flyway migrations for all tables

### Product Service
- [ ] Implement product CRUD operations
- [ ] Implement product listing with pagination
- [ ] Implement product search with filters:
  - By name, SKU, barcode
  - By category (include children)
  - By price range
  - By status (active/inactive)
- [ ] Implement product detail retrieval (with variants)

### Variant Service
- [ ] Implement variant auto-generation from options
  - Generate all combinations
  - Auto-generate SKU based on product SKU + option values
- [ ] Implement variant CRUD
- [ ] Implement bulk variant update (price, status)
- [ ] Handle variant enable/disable

### Barcode Service
- [ ] Implement barcode validation (format check)
- [ ] Implement barcode uniqueness check (tenant-scoped)
- [ ] Implement barcode lookup (return product/variant)
- [ ] Implement barcode generation for products without barcodes

### Category Service
- [ ] Implement category CRUD
- [ ] Implement hierarchical category tree
- [ ] Implement product count per category
- [ ] Implement category reordering

### Bulk Operations
- [ ] Implement CSV import for products
  - Validation
  - Error reporting
  - Progress tracking
- [ ] Implement CSV export
- [ ] Implement bulk price update
- [ ] Implement bulk category assignment

### Caching
- [ ] Cache product catalog in Redis
- [ ] Cache category tree
- [ ] Implement cache invalidation on updates
- [ ] Cache barcode lookups

### Testing
- [ ] Write unit tests for ProductService
- [ ] Write unit tests for variant generation
- [ ] Write integration tests for endpoints
- [ ] Test barcode uniqueness
- [ ] Test bulk import with various scenarios

---

## Frontend Tasks

### Product Pages
- [ ] Create product list page (/products)
  - DataTable with sorting, filtering
  - Quick actions (edit, delete, duplicate)
  - Bulk selection
- [ ] Create product detail page (/products/[id])
- [ ] Create product form page (/products/new, /products/[id]/edit)
  - Basic info tab
  - Variants tab
  - Pricing tab
  - Images tab

### Product Form Components
- [ ] Create ProductForm component
- [ ] Create ImageUploader component
- [ ] Create OptionBuilder component
  - Add/remove options
  - Add/remove option values
  - Reorder values
- [ ] Create VariantTable component
  - Show all variant combinations
  - Inline editing (price, SKU, barcode)
  - Enable/disable variants
- [ ] Create CategorySelector component (hierarchical)
- [ ] Create TagInput component

### Category Management
- [ ] Create category list page (/categories)
- [ ] Create category tree view
- [ ] Create category form (create/edit)
- [ ] Implement drag-drop reordering

### Barcode Features
- [ ] Integrate barcode scanner (QuaggaJS / html5-qrcode)
- [ ] Create BarcodeScanner component
- [ ] Create BarcodeLookup result display
- [ ] Implement barcode printing (label generation)

### Search & Filter
- [ ] Create ProductSearch component
- [ ] Create ProductFilter component
  - Category filter (multi-select)
  - Price range slider
  - Status filter
  - Tag filter
- [ ] Implement search-as-you-type

### Bulk Operations UI
- [ ] Create BulkImportWizard
  - File upload
  - Column mapping
  - Validation preview
  - Import progress
- [ ] Create bulk action toolbar
- [ ] Implement bulk edit dialog

### Offline Support
- [ ] Store product catalog in IndexedDB
- [ ] Implement incremental sync
- [ ] Handle image caching
- [ ] Implement offline search

### Testing
- [ ] Write tests for ProductForm
- [ ] Write tests for VariantTable
- [ ] Write tests for BarcodeScanner
- [ ] E2E test for product creation flow

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/products | List products | Yes |
| POST | /api/v1/products | Create product | Yes |
| GET | /api/v1/products/{id} | Get product | Yes |
| PUT | /api/v1/products/{id} | Update product | Yes |
| DELETE | /api/v1/products/{id} | Delete product | Yes |
| GET | /api/v1/products/search | Search products | Yes |
| GET | /api/v1/products/barcode/{code} | Lookup by barcode | Yes |
| POST | /api/v1/products/import | Bulk import | Yes |
| GET | /api/v1/products/export | Export CSV | Yes |
| GET | /api/v1/categories | List categories | Yes |
| POST | /api/v1/categories | Create category | Yes |
| PUT | /api/v1/categories/{id} | Update category | Yes |
| DELETE | /api/v1/categories/{id} | Delete category | Yes |
| GET | /api/v1/categories/tree | Get category tree | Yes |

---

## Data Models

### CreateProductRequest
```json
{
  "name": "Summer Dress",
  "description": "Comfortable summer dress",
  "sku": "DRESS-001",
  "basePrice": 500000,
  "baseCost": 250000,
  "categoryId": "uuid",
  "tags": ["summer", "women"],
  "hasVariants": true,
  "options": [
    {
      "name": "Color",
      "values": ["Red", "Blue"]
    },
    {
      "name": "Size",
      "values": ["S", "M", "L", "XL"]
    }
  ]
}
```

### ProductResponse
```json
{
  "id": "uuid",
  "name": "Summer Dress",
  "sku": "DRESS-001",
  "basePrice": 500000,
  "baseCost": 250000,
  "category": {
    "id": "uuid",
    "name": "Dresses"
  },
  "hasVariants": true,
  "variantCount": 8,
  "variants": [
    {
      "id": "uuid",
      "sku": "DRESS-001-RED-S",
      "barcode": "1234567890001",
      "optionValues": [
        { "option": "Color", "value": "Red" },
        { "option": "Size", "value": "S" }
      ],
      "price": 500000,
      "cost": 250000,
      "isActive": true
    }
  ]
}
```

---

## Acceptance Criteria

- [ ] User can create product without variants
- [ ] User can create product with variants (auto-generated)
- [ ] User can edit variant prices individually
- [ ] User can assign multiple barcodes to products
- [ ] Barcode lookup returns correct product/variant
- [ ] User can organize products in categories
- [ ] User can bulk import products from CSV
- [ ] Product search works with various filters
- [ ] Products sync to offline storage

---

## Dependencies

- **Requires**: 00-project-setup, 01-authentication, 02-multi-tenant

## Blocks

- 04-inventory (needs products)
- 05-pos (needs products)
