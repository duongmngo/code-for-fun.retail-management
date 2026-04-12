# Retail Management System - Product Requirements Document (PRD)

## Document Information
- **Version**: 1.0
- **Last Updated**: January 25, 2026
- **Status**: Draft

---

## 1. Executive Summary

### 1.1 Product Vision
Build a modern, cloud-native Progressive Web Application (PWA) that empowers small retail stores to efficiently manage their business operations including inventory, sales, and multi-branch coordination - with full offline capability and seamless data synchronization.

### 1.2 Target Users
- Small to medium retail store owners
- Store managers and branch supervisors
- Cashiers and sales staff
- Inventory managers

### 1.3 Key Value Propositions
- **Offline-First**: Full functionality without internet connection
- **Multi-Tenant**: SaaS model supporting multiple independent stores
- **Multi-Branch**: Single store can manage multiple physical locations
- **Barcode Integration**: Fast product lookup and checkout
- **Real-time Sync**: Automatic data synchronization when online

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │   PWA Web    │  │   Android    │  │     iOS      │                   │
│  │   (React)    │  │   (PWA)      │  │    (PWA)     │                   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                   │
│         │                 │                 │                            │
│         └─────────────────┼─────────────────┘                            │
│                           │                                              │
│              ┌────────────▼────────────┐                                 │
│              │     Service Worker      │                                 │
│              │  (Offline/Sync Engine)  │                                 │
│              └────────────┬────────────┘                                 │
│                           │                                              │
│              ┌────────────▼────────────┐                                 │
│              │      IndexedDB          │                                 │
│              │   (Local Storage)       │                                 │
│              └────────────┬────────────┘                                 │
└───────────────────────────┼─────────────────────────────────────────────┘
                            │ HTTPS/WSS
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Modular Monolith)                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      API Layer                                   │    │
│  │              (Authentication, Rate Limiting)                     │    │
│  └────────────────────────────┬────────────────────────────────────┘    │
│                               │                                          │
│  ┌────────────────────────────┼────────────────────────────────────┐    │
│  │                    Application Modules                           │    │
│  │  ┌──────────────────────────────────────────────────────────┐   │    │
│  │  │                   Spring Boot Application                 │   │    │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐            │   │    │
│  │  │  │   Auth     │ │  Tenant    │ │  Product   │            │   │    │
│  │  │  │  Module    │ │  Module    │ │  Module    │            │   │    │
│  │  │  └────────────┘ └────────────┘ └────────────┘            │   │    │
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐            │   │    │
│  │  │  │ Inventory  │ │   Sales    │ │   Sync     │            │   │    │
│  │  │  │  Module    │ │  Module    │ │  Module    │            │   │    │
│  │  │  └────────────┘ └────────────┘ └────────────┘            │   │    │
│  │  │  ┌────────────┐ ┌────────────┐                           │   │    │
│  │  │  │ Reporting  │ │  Common    │  (Shared kernel)          │   │    │
│  │  │  │  Module    │ │  Module    │                           │   │    │
│  │  │  └────────────┘ └────────────┘                           │   │    │
│  │  └──────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                               │                                          │
│  ┌────────────────────────────┼────────────────────────────────────┐    │
│  │                      Data Layer                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │    │
│  │  │  PostgreSQL  │  │    Redis     │  │   Event Bus          │   │    │
│  │  │  (Primary)   │  │   (Cache)    │  │ (Spring Events/Kafka)│   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Modular Monolith Benefits
- **Simpler deployment**: Single deployable unit, easier to manage
- **Lower operational complexity**: No inter-service communication overhead
- **Faster development**: Direct method calls between modules
- **Easier debugging**: Single process, unified logging
- **Future-ready**: Clean module boundaries allow extraction to microservices if needed

---

## 3. Functional Requirements

### 3.1 Multi-Tenant Management

#### 3.1.1 Tenant (Store) Registration
| ID | Requirement | Priority |
|----|-------------|----------|
| MT-001 | System shall allow new stores to self-register with business information | P0 |
| MT-002 | Each tenant shall have a unique subdomain or identifier | P0 |
| MT-003 | Tenant data shall be completely isolated from other tenants | P0 |
| MT-004 | System shall support tenant-level configuration and branding | P1 |
| MT-005 | System shall support subscription/billing management | P1 |

#### 3.1.2 Branch & Warehouse Management
| ID | Requirement | Priority |
|----|-------------|----------|
| BR-001 | Tenant shall be able to create multiple branches | P0 |
| BR-002 | Each branch shall have unique identifier, name, and address | P0 |
| BR-003 | Inventory can be tracked per branch or shared across branches | P0 |
| BR-004 | Branch shall have independent operating settings (tax, currency) | P1 |
| BR-005 | Support location types: Branch (sells to customers) or Warehouse (storage only) | P1 |
| BR-006 | Central warehouse for bulk storage and distribution | P1 |
| BR-007 | Define default source warehouse for each branch | P2 |
| BR-005 | Support inter-branch stock transfers | P1 |

### 3.2 User Management

#### 3.2.1 Authentication
| ID | Requirement | Priority |
|----|-------------|----------|
| AU-001 | System shall support email/password authentication | P0 |
| AU-002 | System shall support OAuth (Google, Microsoft) | P1 |
| AU-003 | System shall support PIN-based quick login for POS | P0 |
| AU-004 | System shall support multi-factor authentication | P2 |
| AU-005 | Session management with configurable timeout | P0 |

#### 3.2.2 Authorization & Roles
| ID | Requirement | Priority |
|----|-------------|----------|
| RO-001 | Owner: Full access to all features and settings | P0 |
| RO-002 | Manager: Branch management, reports, inventory | P0 |
| RO-003 | Cashier: POS operations, basic inventory view | P0 |
| RO-004 | Inventory Staff: Stock management, receiving | P0 |
| RO-005 | Custom roles with granular permissions | P2 |

### 3.3 Product Management

#### 3.3.1 Product Catalog
| ID | Requirement | Priority |
|----|-------------|----------|
| PR-001 | Create, read, update, delete products | P0 |
| PR-002 | Product fields: name, SKU, barcode, description, images | P0 |
| PR-003 | Support multiple barcodes per product | P0 |
| PR-004 | Product categories and subcategories (hierarchical) | P0 |
| PR-005 | Product tags for flexible organization | P1 |
| PR-006 | Bulk import/export (CSV, Excel) | P1 |
| PR-007 | Product search with barcode scanner | P0 |

#### 3.3.2 Product Variants & Options

Products can have multiple variant options where each option has multiple values. The combination of option values creates unique variants.

**Dynamic Options:** Option names and values are **fully dynamic and tenant-defined** - not a predefined list. Each tenant can create any options relevant to their business (e.g., a clothing store might use "Color" and "Size", while an electronics store might use "Storage Capacity" and "Color").

**Example:**
```
Product: Summer Dress
├── Option 1: Color (dynamic, created by tenant)
│   ├── Value: Red
│   └── Value: Blue
└── Option 2: Size (dynamic, created by tenant)
    ├── Value: S
    ├── Value: M
    ├── Value: L
    └── Value: XL

Resulting Variants (2 colors × 4 sizes = 8 variants):
├── Summer Dress - Red / S  (SKU: DRESS-RED-S, Barcode: 1234567890001)
├── Summer Dress - Red / M  (SKU: DRESS-RED-M, Barcode: 1234567890002)
├── Summer Dress - Red / L  (SKU: DRESS-RED-L, Barcode: 1234567890003)
├── Summer Dress - Red / XL (SKU: DRESS-RED-XL, Barcode: 1234567890004)
├── Summer Dress - Blue / S  (SKU: DRESS-BLU-S, Barcode: 1234567890005)
├── Summer Dress - Blue / M  (SKU: DRESS-BLU-M, Barcode: 1234567890006)
├── Summer Dress - Blue / L  (SKU: DRESS-BLU-L, Barcode: 1234567890007)
└── Summer Dress - Blue / XL (SKU: DRESS-BLU-XL, Barcode: 1234567890008)
```

| ID | Requirement | Priority |
|----|-------------|----------|
| PV-001 | Tenant can create custom option names (dynamic, not predefined) | P1 |
| PV-002 | Tenant can add any values to each option (dynamic) | P1 |
| PV-003 | Options are defined per-product (not global) | P1 |
| PV-004 | Support up to 3 options per product | P1 |
| PV-005 | Auto-generate variants from option combinations | P1 |
| PV-006 | Each variant has unique SKU | P1 |
| PV-007 | Each variant can have unique barcode | P1 |
| PV-008 | Variant-level pricing (override base price) | P1 |
| PV-009 | Variant-level cost price | P1 |
| PV-010 | Variant-level stock tracking | P1 |
| PV-011 | Variant-level images | P2 |
| PV-012 | Bulk edit variants (price, stock) | P1 |
| PV-013 | Enable/disable individual variants | P1 |
| PV-014 | Reusable option templates for quick setup (tenant-defined) | P2 |
| PV-015 | Option value display order | P2 |
| PV-016 | Search/filter by variant option values | P1 |

#### 3.3.3 Pricing
| ID | Requirement | Priority |
|----|-------------|----------|
| PC-001 | Base price and cost price per product | P0 |
| PC-002 | Variant-level price override | P1 |
| PC-003 | Branch-specific pricing | P1 |
| PC-004 | Price history tracking | P2 |
| PC-005 | Promotional pricing with date ranges | P1 |
| PC-006 | Quantity-based pricing (buy X get Y) | P2 |

### 3.4 Inventory Management

#### 3.4.1 Stock Control
| ID | Requirement | Priority |
|----|-------------|----------|
| IN-001 | Track current stock quantity per product per branch | P0 |
| IN-002 | Set minimum stock levels (reorder point) | P0 |
| IN-003 | Low stock alerts and notifications | P0 |
| IN-004 | Stock adjustment with reason codes | P0 |
| IN-005 | Stock movement history (audit trail) | P0 |
| IN-006 | Batch/Lot tracking | P2 |
| IN-007 | Expiry date tracking | P2 |

#### 3.4.2 Stock Operations
| ID | Requirement | Priority |
|----|-------------|----------|
| SO-001 | Stock receiving (purchase orders) | P0 |
| SO-002 | Stock transfers between branches | P1 |
| SO-003 | Stock take/Physical inventory count | P0 |
| SO-004 | Damage/Wastage recording | P1 |
| SO-005 | Return to supplier | P2 |

### 3.5 Material & Ingredient Management

For businesses that need to manage raw materials (e.g., coffee shops, restaurants, bakeries), the system supports material/ingredient tracking with warehouse distribution.

**Use Case Example - Coffee Shop:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Material Flow: Coffee Shop Example                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Supplier                                                                   │
│      │                                                                       │
│      │ Purchase Order (PO-001)                                               │
│      │ - Coffee Beans: 50kg @ 200,000 VND/kg                                │
│      │ - Milk: 100L @ 25,000 VND/L                                          │
│      │ - Sugar: 20kg @ 15,000 VND/kg                                        │
│      ▼                                                                       │
│   ┌─────────────────────┐                                                   │
│   │   Central Warehouse │  (Receive & Store bulk materials)                 │
│   │   ─────────────────│                                                   │
│   │   Coffee: 50kg      │                                                   │
│   │   Milk: 100L        │                                                   │
│   │   Sugar: 20kg       │                                                   │
│   └──────────┬──────────┘                                                   │
│              │                                                               │
│              │ Transfer Request (TR-001)                                     │
│              │                                                               │
│      ┌───────┴───────┐                                                      │
│      │               │                                                       │
│      ▼               ▼                                                       │
│   ┌─────────┐    ┌─────────┐                                                │
│   │ Branch A│    │ Branch B│                                                │
│   │─────────│    │─────────│                                                │
│   │Coffee:5kg    │Coffee:3kg                                                │
│   │Milk: 20L│    │Milk: 15L│                                                │
│   │Sugar: 3kg    │Sugar: 2kg                                                │
│   └────┬────┘    └────┬────┘                                                │
│        │              │                                                      │
│        ▼              ▼                                                      │
│   Make drinks    Make drinks                                                 │
│   (consume       (consume                                                    │
│   materials)     materials)                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 3.5.1 Material Catalog
| ID | Requirement | Priority |
|----|-------------|----------|
| MAT-001 | Create materials/ingredients separate from sellable products | P1 |
| MAT-002 | Material fields: name, SKU, unit of measure, description | P1 |
| MAT-003 | Support multiple units (kg, g, L, mL, pieces) with conversion | P1 |
| MAT-004 | Material categories (e.g., Dairy, Coffee, Packaging) | P1 |
| MAT-005 | Track cost price per unit | P1 |
| MAT-006 | Set minimum stock levels per location | P1 |
| MAT-007 | Expiry date tracking for perishables | P2 |
| MAT-008 | Barcode support for materials | P2 |

#### 3.5.2 Material Procurement
| ID | Requirement | Priority |
|----|-------------|----------|
| MP-001 | Create purchase orders for materials | P1 |
| MP-002 | Receive materials into warehouse/branch | P1 |
| MP-003 | Record supplier information | P1 |
| MP-004 | Track purchase price history | P2 |
| MP-005 | Partial receiving (receive part of PO) | P2 |
| MP-006 | Purchase order approval workflow | P3 |

#### 3.5.3 Warehouse to Branch Transfers
| ID | Requirement | Priority |
|----|-------------|----------|
| WT-001 | Create transfer request from branch to warehouse | P1 |
| WT-002 | Create transfer order from warehouse to branch | P1 |
| WT-003 | Transfer status tracking (Pending → In Transit → Received) | P1 |
| WT-004 | Branch confirms receipt of transferred materials | P1 |
| WT-005 | Partial transfer receiving | P2 |
| WT-006 | Transfer history with full audit trail | P1 |
| WT-007 | Auto-suggest transfers based on low stock at branch | P2 |
| WT-008 | Transfer cost tracking (for internal accounting) | P2 |
| WT-009 | Inter-branch transfers (branch to branch) | P2 |
| WT-010 | Bulk transfer creation | P2 |

#### 3.5.4 Material Consumption
| ID | Requirement | Priority |
|----|-------------|----------|
| MC-001 | Record material usage/consumption at branch | P1 |
| MC-002 | Link product recipes to materials (e.g., 1 Latte = 20g coffee + 200mL milk) | P2 |
| MC-003 | Auto-deduct materials when product is sold (based on recipe) | P2 |
| MC-004 | Manual consumption adjustment with reason | P1 |
| MC-005 | Wastage/spoilage recording | P1 |
| MC-006 | Consumption reports by material, branch, time period | P1 |

### 3.6 Sales & Point of Sale (POS)

#### 3.5.1 POS Operations
| ID | Requirement | Priority |
|----|-------------|----------|
| POS-001 | Create new sale transaction | P0 |
| POS-002 | Add items by barcode scan | P0 |
| POS-003 | Add items by search/browse | P0 |
| POS-004 | Modify quantity in cart | P0 |
| POS-005 | Remove items from cart | P0 |
| POS-006 | Apply discounts (item-level, cart-level) | P0 |
| POS-007 | Hold and recall transactions | P1 |
| POS-008 | Split payment methods | P1 |
| POS-009 | Print/Email receipt | P0 |
| POS-010 | Quick keys for frequent items | P1 |

#### 3.5.2 Payment Processing
| ID | Requirement | Priority |
|----|-------------|----------|
| PAY-001 | Cash payment with change calculation | P0 |
| PAY-002 | Card payment integration | P1 |
| PAY-003 | Mobile payment (QR codes) | P2 |
| PAY-004 | Store credit/Gift cards | P2 |
| PAY-005 | Payment on account (for B2B) | P2 |

#### 3.5.4 Tenant Payment Configuration

Each tenant can configure their own payment methods based on their business requirements and local regulations. The system supports tenant-specific payment gateway configurations.

**Payment Configuration Model:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Tenant Payment Configuration Model                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────┐         ┌──────────────────────────┐                 │
│   │      Tenant      │ 1───n ► │  TenantPaymentConfig     │                 │
│   │──────────────────│         │──────────────────────────│                 │
│   │ id               │         │ id                       │                 │
│   │ name             │         │ tenant_id (FK)           │                 │
│   │ country_code     │         │ payment_method (enum)    │                 │
│   └──────────────────┘         │ provider (VNPAY/MOMO/..) │                 │
│                                │ is_enabled               │                 │
│                                │ display_order            │                 │
│                                │ configuration (JSON)     │                 │
│                                │   - api_key (encrypted)  │                 │
│                                │   - merchant_id          │                 │
│                                │   - callback_url         │                 │
│                                │   - environment (sandbox/│                 │
│                                │     production)          │                 │
│                                └──────────────────────────┘                 │
│                                                                              │
│   Payment Methods (Enum):                                                   │
│   ──────────────────────                                                    │
│   - CASH                 (No configuration needed)                          │
│   - BANK_TRANSFER        (Bank account details)                             │
│   - CARD                 (Stripe/Square/local processor)                    │
│   - MOBILE_PAYMENT       (VNPay, MoMo, ZaloPay, GrabPay, etc.)             │
│   - QR_CODE              (VietQR, PromptPay, etc.)                          │
│   - EWALLET              (PayPal, local e-wallets)                          │
│   - STORE_CREDIT         (Internal)                                         │
│   - GIFT_CARD            (Internal or third-party)                          │
│                                                                              │
│   Example Configuration (Vietnam):                                          │
│   ────────────────────────────────                                          │
│   Tenant: "Cà Phê Sài Gòn"                                                  │
│   ├── CASH (enabled, order: 1)                                              │
│   ├── MOBILE_PAYMENT - VNPay (enabled, order: 2)                            │
│   │   └── config: {merchant_id: "xxx", api_key: "encrypted_key"}           │
│   ├── MOBILE_PAYMENT - MoMo (enabled, order: 3)                             │
│   │   └── config: {partner_code: "xxx", access_key: "encrypted"}           │
│   └── QR_CODE - VietQR (enabled, order: 4)                                  │
│       └── config: {bank_id: "970415", account_no: "xxx"}                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

| ID | Requirement | Priority |
|----|-------------|----------|
| TPC-001 | Tenant can enable/disable payment methods | P1 |
| TPC-002 | Tenant can configure payment gateway credentials | P1 |
| TPC-003 | Support multiple providers for same payment type | P1 |
| TPC-004 | Secure storage for API keys and secrets | P0 |
| TPC-005 | Payment method display order configuration | P2 |
| TPC-006 | Branch-level payment method override | P2 |
| TPC-007 | Payment provider sandbox/production mode toggle | P1 |
| TPC-008 | Payment webhook handling per provider | P1 |
| TPC-009 | Transaction fee configuration per method | P2 |
| TPC-010 | Daily/Monthly payment limits per method | P2 |

#### 3.5.3 Returns & Refunds
| ID | Requirement | Priority |
|----|-------------|----------|
| RF-001 | Process returns with receipt | P0 |
| RF-002 | Process returns without receipt | P1 |
| RF-003 | Partial refunds | P0 |
| RF-004 | Exchange processing | P1 |
| RF-005 | Refund to original payment method | P1 |

### 3.6 Barcode Support

| ID | Requirement | Priority |
|----|-------------|----------|
| BC-001 | Support EAN-13, EAN-8, UPC-A, UPC-E barcodes | P0 |
| BC-002 | Support Code 128, Code 39 barcodes | P0 |
| BC-003 | Support QR codes | P1 |
| BC-004 | Generate barcodes for products without them | P0 |
| BC-005 | Print barcode labels | P0 |
| BC-006 | Camera-based barcode scanning | P0 |
| BC-007 | External USB/Bluetooth scanner support | P0 |

### 3.8 Reporting & Analytics

#### 3.8.1 Sales Reports
| ID | Requirement | Priority |
|----|-------------|----------|
| RP-001 | Sales summary (daily, weekly, monthly, yearly) | P0 |
| RP-002 | Sales by product/category | P0 |
| RP-003 | Sales by staff member | P1 |
| RP-004 | Sales by payment method | P1 |
| RP-005 | Sales by time of day/day of week (trend analysis) | P2 |
| RP-006 | Top selling products | P0 |
| RP-007 | Slow moving products | P1 |

#### 3.8.2 Inventory Reports
| ID | Requirement | Priority |
|----|-------------|----------|
| RP-010 | Inventory valuation report (current stock value) | P0 |
| RP-011 | Low stock report | P0 |
| RP-012 | Stock movement history | P0 |
| RP-013 | Material consumption report | P1 |
| RP-014 | Transfer history report | P1 |
| RP-015 | Wastage/shrinkage report | P1 |
| RP-016 | Stock aging report | P2 |

#### 3.8.3 Revenue & Profit Reports

**Revenue & Profit Calculation:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Revenue & Profit Calculation Model                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   REVENUE (Doanh thu)                                                        │
│   ═══════════════════                                                        │
│   Gross Revenue     = Sum of all sales (before discounts)                   │
│   Net Revenue       = Gross Revenue - Discounts - Returns                   │
│                                                                              │
│   COST OF GOODS SOLD (Giá vốn hàng bán - COGS)                              │
│   ═══════════════════════════════════════════                               │
│   Product COGS      = Quantity Sold × Cost Price per unit                   │
│   Material COGS     = Materials consumed × Material cost                    │
│   Total COGS        = Product COGS + Material COGS                          │
│                                                                              │
│   GROSS PROFIT (Lợi nhuận gộp)                                              │
│   ════════════════════════════                                              │
│   Gross Profit      = Net Revenue - Total COGS                              │
│   Gross Margin %    = (Gross Profit / Net Revenue) × 100                    │
│                                                                              │
│   OPERATING EXPENSES (Chi phí hoạt động) - Optional tracking                │
│   ═══════════════════════════════════════════════════════                   │
│   - Staff wages                                                              │
│   - Rent                                                                     │
│   - Utilities                                                                │
│   - Other expenses                                                           │
│                                                                              │
│   NET PROFIT (Lợi nhuận ròng)                                               │
│   ═══════════════════════════                                               │
│   Net Profit        = Gross Profit - Operating Expenses                     │
│   Net Margin %      = (Net Profit / Net Revenue) × 100                      │
│                                                                              │
│   Example:                                                                   │
│   ─────────────────────────────────────────────────────                     │
│   Sell 100 Lattes @ 50,000 VND each                                         │
│   - Gross Revenue: 5,000,000 VND                                            │
│   - Discounts: 200,000 VND                                                  │
│   - Net Revenue: 4,800,000 VND                                              │
│   - Material cost per Latte: 15,000 VND (coffee + milk + sugar)             │
│   - Total COGS: 1,500,000 VND                                               │
│   - Gross Profit: 3,300,000 VND                                             │
│   - Gross Margin: 68.75%                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

| ID | Requirement | Priority |
|----|-------------|----------|
| RP-020 | Revenue report (gross, net, by period) | P0 |
| RP-021 | Cost of Goods Sold (COGS) tracking | P0 |
| RP-022 | Gross profit calculation and report | P0 |
| RP-023 | Profit margin by product/category | P1 |
| RP-024 | Profit margin by branch | P1 |
| RP-025 | Revenue vs Cost trend chart | P1 |
| RP-026 | Daily/Weekly/Monthly P&L summary | P1 |
| RP-027 | Operating expense tracking (optional) | P2 |
| RP-028 | Net profit calculation (if expenses tracked) | P2 |
| RP-029 | Break-even analysis | P3 |
| RP-030 | Budget vs Actual comparison | P3 |

#### 3.8.4 General Report Features
| ID | Requirement | Priority |
|----|-------------|----------|
| RP-040 | Cash drawer reconciliation | P0 |
| RP-041 | Export reports to PDF/Excel | P1 |
| RP-042 | Dashboard with key metrics (KPIs) | P0 |
| RP-043 | Branch comparison reports | P1 |
| RP-044 | Custom date range for all reports | P0 |
| RP-045 | Schedule automated report generation | P2 |
| RP-046 | Email reports to stakeholders | P2 |

### 3.9 Customer Management (Optional Phase)

| ID | Requirement | Priority |
|----|-------------|----------|
| CU-001 | Customer registration | P2 |
| CU-002 | Customer purchase history | P2 |
| CU-003 | Loyalty points program | P3 |
| CU-004 | Customer groups with special pricing | P3 |

---

## 4. Non-Functional Requirements

### 4.1 Progressive Web App (PWA) Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| PWA-001 | Installable on desktop and mobile devices | P0 |
| PWA-002 | Works offline with full POS functionality | P0 |
| PWA-003 | Automatic background sync when online | P0 |
| PWA-004 | Push notifications for alerts | P1 |
| PWA-005 | App-like experience (no browser UI) | P0 |
| PWA-006 | Fast initial load (< 3 seconds) | P0 |
| PWA-007 | Responsive design for all screen sizes | P0 |

### 4.2 Offline-First Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                    Offline-First Data Flow                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   User Action                                                           │
│       │                                                                 │
│       ▼                                                                 │
│   ┌───────────────────┐                                                │
│   │  Write to Local   │                                                │
│   │    IndexedDB      │                                                │
│   └─────────┬─────────┘                                                │
│             │                                                           │
│             ▼                                                           │
│   ┌───────────────────┐     ┌───────────────────┐                      │
│   │   Update UI       │     │  Queue for Sync   │                      │
│   │   Immediately     │     │  (Pending Ops)    │                      │
│   └───────────────────┘     └─────────┬─────────┘                      │
│                                       │                                 │
│                     ┌─────────────────┴─────────────────┐              │
│                     │         Online?                    │              │
│                     └─────────────────┬─────────────────┘              │
│                            ┌──────────┴──────────┐                     │
│                           YES                    NO                     │
│                            │                      │                     │
│                            ▼                      ▼                     │
│               ┌─────────────────────┐    ┌─────────────────┐           │
│               │   Sync to Server   │    │  Keep in Queue   │           │
│               │   (Background)     │    │  (Retry Later)   │           │
│               └──────────┬─────────┘    └─────────────────┘           │
│                          │                                             │
│                          ▼                                             │
│               ┌─────────────────────┐                                  │
│               │  Conflict           │                                  │
│               │  Resolution         │                                  │
│               │  (Last Write Wins   │                                  │
│               │   or Merge)         │                                  │
│               └─────────────────────┘                                  │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

| ID | Requirement | Priority |
|----|-------------|----------|
| OFF-001 | All critical data cached locally (products, inventory) | P0 |
| OFF-002 | Sales transactions work without internet | P0 |
| OFF-003 | Operations queued when offline | P0 |
| OFF-004 | Automatic sync when connection restored | P0 |
| OFF-005 | Conflict resolution strategy (configurable) | P0 |
| OFF-006 | Visual indicator of online/offline status | P0 |
| OFF-007 | Sync progress indicator | P0 |
| OFF-008 | Manual sync trigger option | P1 |

### 4.3 Offline Mode User Awareness

The system must clearly communicate offline status and sync state to users to prevent confusion and data loss.

**Offline Awareness UI Components:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Offline Mode User Awareness Design                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. Status Bar Indicator (Always Visible)                                  │
│   ═════════════════════════════════════════                                 │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │ 🟢 Online                                        │ Sync: Up to date │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │ 🔴 Offline                                       │ Pending: 5 items │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │ 🟡 Syncing...                                    │ 3 of 10 items    │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│   2. Connection State Notifications                                         │
│   ══════════════════════════════════                                        │
│                                                                              │
│   [Toast] "You're offline. Changes will sync when connected."              │
│   [Toast] "Back online! Syncing 5 pending transactions..."                 │
│   [Toast] "Sync complete. All data is up to date."                         │
│   [Toast] "Sync failed for 2 items. Tap to retry."                         │
│                                                                              │
│   3. Pending Items Panel (Accessible from status bar)                       │
│   ════════════════════════════════════════════════                          │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │                    Pending Sync Items                            │       │
│   │─────────────────────────────────────────────────────────────────│       │
│   │ 📋 Sale #1234        10:30 AM    Pending     [View] [Retry]     │       │
│   │ 📋 Sale #1235        10:45 AM    Pending     [View] [Retry]     │       │
│   │ 📦 Stock Adjust      11:00 AM    Failed      [View] [Retry]     │       │
│   │─────────────────────────────────────────────────────────────────│       │
│   │                              [Sync All] [Clear Failed]          │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
│   4. Data Freshness Indicators                                              │
│   ════════════════════════════                                              │
│                                                                              │
│   On list views, show last sync time:                                       │
│   "Product catalog last updated: 2 hours ago" ⚠️                            │
│   "Inventory synced: Just now" ✓                                           │
│                                                                              │
│   5. Conflict Resolution UI                                                 │
│   ══════════════════════════                                                │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────┐       │
│   │                    ⚠️ Sync Conflict Detected                    │       │
│   │─────────────────────────────────────────────────────────────────│       │
│   │ Product "Coffee Beans" was modified both locally and remotely.  │       │
│   │                                                                  │       │
│   │   Local (Your changes):     Server version:                      │       │
│   │   Price: 250,000 VND        Price: 280,000 VND                  │       │
│   │   Stock: 50                 Stock: 45                           │       │
│   │                                                                  │       │
│   │   [Keep Local] [Accept Server] [Merge (Keep Higher Price)]      │       │
│   └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

| ID | Requirement | Priority |
|----|-------------|----------|
| OA-001 | Persistent status bar showing online/offline state | P0 |
| OA-002 | Badge showing number of pending sync items | P0 |
| OA-003 | Toast notifications for connection state changes | P0 |
| OA-004 | Accessible pending sync items panel | P0 |
| OA-005 | Manual retry for failed sync items | P0 |
| OA-006 | Data freshness indicator on list views | P1 |
| OA-007 | Conflict resolution UI for merge conflicts | P1 |
| OA-008 | Sync history log (last 24 hours) | P2 |
| OA-009 | Option to force full re-sync | P1 |
| OA-010 | Warning before logout with pending sync items | P0 |
| OA-011 | Estimated sync time based on queue size | P2 |
| OA-012 | Background sync with progress notification | P1 |

### 4.3 Performance Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| PERF-001 | Page load time | < 3 seconds |
| PERF-002 | POS transaction completion | < 2 seconds |
| PERF-003 | Barcode scan to product display | < 500ms |
| PERF-004 | Search results display | < 1 second |
| PERF-005 | Report generation | < 5 seconds |
| PERF-006 | API response time (p95) | < 200ms |
| PERF-007 | Support concurrent users per tenant | 50+ |

### 4.4 Security Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-001 | All data encrypted in transit (TLS 1.3) | P0 |
| SEC-002 | Sensitive data encrypted at rest | P0 |
| SEC-003 | JWT-based authentication with refresh tokens | P0 |
| SEC-004 | Role-based access control (RBAC) | P0 |
| SEC-005 | Audit logging for sensitive operations | P0 |
| SEC-006 | SQL injection prevention | P0 |
| SEC-007 | XSS prevention | P0 |
| SEC-008 | CSRF protection | P0 |
| SEC-009 | Rate limiting | P0 |
| SEC-010 | Regular security updates | P0 |

### 4.5 Scalability Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| SCA-001 | Support number of tenants | 1000+ |
| SCA-002 | Products per tenant | 100,000+ |
| SCA-003 | Transactions per day per tenant | 10,000+ |
| SCA-004 | Historical data retention | 7 years |
| SCA-005 | Horizontal scaling capability | Yes |

### 4.6 Availability & Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| AVL-001 | System uptime | 99.9% |
| AVL-002 | Automated backups | Daily |
| AVL-003 | Point-in-time recovery | Yes |
| AVL-004 | Disaster recovery RTO | < 4 hours |
| AVL-005 | Disaster recovery RPO | < 1 hour |

---

## 5. Data Model Overview

### 5.1 Core Entities

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Entity Relationship Overview                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────┐         ┌─────────┐         ┌─────────┐                   │
│   │ Tenant  │ 1───n ► │ Branch  │ 1───n ► │  User   │                   │
│   └────┬────┘         └────┬────┘         └─────────┘                   │
│        │                   │                                             │
│        │ 1                 │ 1                                           │
│        │                   │                                             │
│        ▼ n                 ▼ n                                           │
│   ┌─────────┐         ┌─────────────┐                                   │
│   │ Product │ 1───n ► │  Inventory  │                                   │
│   └────┬────┘         │  (Stock)    │                                   │
│        │              └─────────────┘                                   │
│        │ 1                                                               │
│        │                                                                 │
│        ▼ n                                                               │
│   ┌───────────┐       ┌─────────────┐       ┌─────────────┐             │
│   │ Sale Item │ n───1 │    Sale     │ n───1 │   Branch    │             │
│   └───────────┘       └──────┬──────┘       └─────────────┘             │
│                              │ 1                                         │
│                              │                                           │
│                              ▼ n                                         │
│                        ┌───────────┐                                    │
│                        │  Payment  │                                    │
│                        └───────────┘                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Product Variant Data Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Product Variant Data Model                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────┐                                                       │
│   │     Product      │                                                       │
│   │──────────────────│                                                       │
│   │ id               │                                                       │
│   │ name             │                                                       │
│   │ description      │                                                       │
│   │ base_price       │                                                       │
│   │ base_cost        │                                                       │
│   │ has_variants     │                                                       │
│   └────────┬─────────┘                                                       │
│            │                                                                 │
│            │ 1                                                               │
│            │                                                                 │
│            ▼ n                                                               │
│   ┌──────────────────┐         ┌──────────────────┐                          │
│   │  ProductOption   │         │   OptionValue    │                          │
│   │──────────────────│ 1───n ► │──────────────────│                          │
│   │ id               │         │ id               │                          │
│   │ product_id (FK)  │         │ option_id (FK)   │                          │
│   │ name (Color/Size)│         │ value (Red/S/M)  │                          │
│   │ display_order    │         │ display_order    │                          │
│   └──────────────────┘         │ color_code       │                          │
│                                └────────┬─────────┘                          │
│                                         │                                    │
│                                         │ n                                  │
│                                         │                                    │
│                                         ▼ n                                  │
│   ┌──────────────────┐         ┌──────────────────┐                          │
│   │  ProductVariant  │ n───n ► │ VariantOptionVal │ (Junction Table)         │
│   │──────────────────│         │──────────────────│                          │
│   │ id               │         │ variant_id (FK)  │                          │
│   │ product_id (FK)  │         │ option_value_id  │                          │
│   │ sku              │         └──────────────────┘                          │
│   │ barcode          │                                                       │
│   │ price (override) │                                                       │
│   │ cost (override)  │                                                       │
│   │ is_active        │                                                       │
│   └────────┬─────────┘                                                       │
│            │                                                                 │
│            │ 1                                                               │
│            ▼ n                                                               │
│   ┌──────────────────┐                                                       │
│   │    Inventory     │ (Stock per Variant per Branch)                        │
│   │──────────────────│                                                       │
│   │ variant_id (FK)  │                                                       │
│   │ branch_id (FK)   │                                                       │
│   │ quantity         │                                                       │
│   │ reorder_level    │                                                       │
│   └──────────────────┘                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
1. Products without variants: `has_variants = false`, inventory tracked at product level
2. Products with variants: `has_variants = true`, inventory tracked at variant level
3. Variant price/cost can override product base_price/base_cost (null = use base)
4. Each variant combination must be unique within a product
5. Barcode lookup returns the specific variant, not just the product

### 5.3 Material & Warehouse Data Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Material & Warehouse Data Model                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────┐         ┌──────────────────┐                         │
│   │     Location     │         │     Material     │                         │
│   │──────────────────│         │──────────────────│                         │
│   │ id               │         │ id               │                         │
│   │ tenant_id        │         │ tenant_id        │                         │
│   │ name             │         │ name             │                         │
│   │ type (WAREHOUSE/ │         │ sku              │                         │
│   │       BRANCH)    │         │ unit_of_measure  │                         │
│   │ is_default_wh    │         │ cost_price       │                         │
│   │ parent_id (FK)   │         │ category_id      │                         │
│   └────────┬─────────┘         │ reorder_level    │                         │
│            │                   └────────┬─────────┘                         │
│            │ 1                          │ 1                                 │
│            │                            │                                   │
│            ▼ n                          ▼ n                                 │
│   ┌──────────────────────────────────────────────┐                          │
│   │              MaterialInventory               │                          │
│   │──────────────────────────────────────────────│                          │
│   │ material_id (FK)                             │                          │
│   │ location_id (FK)  (warehouse or branch)      │                          │
│   │ quantity                                     │                          │
│   │ reserved_quantity                            │                          │
│   └──────────────────────────────────────────────┘                          │
│                                                                              │
│   ┌──────────────────┐         ┌──────────────────┐                         │
│   │  PurchaseOrder   │ 1───n ► │ PurchaseOrderItem│                         │
│   │──────────────────│         │──────────────────│                         │
│   │ id               │         │ material_id (FK) │                         │
│   │ supplier_id      │         │ quantity         │                         │
│   │ location_id (FK) │         │ unit_price       │                         │
│   │ status           │         │ received_qty     │                         │
│   │ total_amount     │         └──────────────────┘                         │
│   └──────────────────┘                                                      │
│                                                                              │
│   ┌──────────────────┐         ┌──────────────────┐                         │
│   │ TransferOrder    │ 1───n ► │ TransferItem     │                         │
│   │──────────────────│         │──────────────────│                         │
│   │ id               │         │ material_id (FK) │                         │
│   │ from_location_id │         │ quantity         │                         │
│   │ to_location_id   │         │ received_qty     │                         │
│   │ status (PENDING/ │         └──────────────────┘                         │
│   │  IN_TRANSIT/     │                                                      │
│   │  RECEIVED)       │                                                      │
│   │ requested_by     │                                                      │
│   │ approved_by      │                                                      │
│   └──────────────────┘                                                      │
│                                                                              │
│   ┌──────────────────┐         ┌──────────────────┐                         │
│   │  ProductRecipe   │ 1───n ► │ RecipeIngredient │                         │
│   │──────────────────│         │──────────────────│                         │
│   │ product_id (FK)  │         │ material_id (FK) │                         │
│   │ name             │         │ quantity         │                         │
│   │ yield_quantity   │         │ unit             │                         │
│   └──────────────────┘         └──────────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Key Entities Description

| Entity | Description |
|--------|-------------|
| **Tenant** | A store/business that subscribes to the system |
| **Location** | Physical location - can be WAREHOUSE or BRANCH type |
| **Branch** | Alias for Location with type=BRANCH (sells to customers) |
| **Warehouse** | Alias for Location with type=WAREHOUSE (storage/distribution) |
| **User** | Staff member with assigned role(s) |
| **Product** | Base item that can be sold (may have variants) |
| **ProductOption** | Attribute type for variants (e.g., "Color", "Size") |
| **OptionValue** | Specific value for an option (e.g., "Red", "XL") |
| **ProductVariant** | Specific sellable combination of option values |
| **VariantOptionValue** | Junction table linking variants to their option values |
| **Category** | Hierarchical product classification |
| **Inventory** | Stock level of product variant at specific location |
| **Material** | Raw material or ingredient (not directly sold) |
| **MaterialInventory** | Stock level of material at specific location |
| **PurchaseOrder** | Order to purchase materials from supplier |
| **TransferOrder** | Request to move materials between locations |
| **ProductRecipe** | Recipe defining materials needed to make a product |
| **RecipeIngredient** | Material and quantity needed in a recipe |
| **Sale** | A sales transaction |
| **SaleItem** | Line item in a sale (references variant) |
| **Payment** | Payment record for a sale |
| **StockMovement** | Record of inventory/material changes |

---

## 6. Technology Stack

### 6.1 Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 18+ with TypeScript |
| Meta Framework | Next.js 14+ (App Router) |
| State Management | Zustand + React Query (TanStack Query) |
| PWA | Workbox + Service Workers |
| Offline Storage | IndexedDB (via Dexie.js) |
| UI Components | Shadcn/ui + Tailwind CSS |
| Forms | React Hook Form + Zod |
| Barcode | QuaggaJS / html5-qrcode |
| Charts | Recharts |

### 6.2 Backend (Modular Monolith)
| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.2+ (Java 21) |
| Architecture | Modular Monolith (package-based modules) |
| API | REST (OpenAPI documented) |
| Security | Spring Security + JWT |
| Database | PostgreSQL 16 (single database, schema per module) |
| Cache | Redis |
| Event Bus | Spring Application Events (in-process), Kafka (optional for async) |
| Search | PostgreSQL Full-Text or Elasticsearch |
| File Storage | S3-compatible (MinIO for self-hosted) |

**Module Structure:**
```
src/main/java/com/retailmanagement/
├── common/          # Shared kernel (exceptions, utils, security)
├── auth/            # Authentication & authorization
├── tenant/          # Multi-tenant management
├── product/         # Product catalog & variants
├── inventory/       # Stock management
├── sales/           # POS & transactions
├── sync/            # Offline sync handling
└── reporting/       # Reports & analytics
```

### 6.3 Infrastructure
| Component | Technology |
|-----------|------------|
| Containerization | Docker |
| Orchestration | Kubernetes (optional) |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| Logging | ELK Stack or Loki |
| Cloud Provider | AWS / GCP / Azure (flexible) |

---

## 7. Project Phases

### Phase 1: Foundation (MVP) - 12 weeks
- Multi-tenant setup with basic tenant management
- Single branch per tenant
- User authentication and basic roles
- Product catalog with barcode support
- Basic inventory management
- Simple POS with cash payment
- Basic offline capability
- Essential reports

### Phase 2: Enhanced Features - 8 weeks
- Multi-branch support with transfers
- Advanced inventory features
- Multiple payment methods
- Enhanced offline sync
- More reports and dashboard
- Bulk import/export

### Phase 3: Advanced Features - 8 weeks
- Customer management
- Promotions and discounts
- Advanced analytics
- API for integrations
- Mobile app optimization

### Phase 4: Scale & Optimize - Ongoing
- Performance optimization
- Advanced security features
- Third-party integrations
- Enterprise features

---

## 8. Appendix

### 8.1 Glossary
| Term | Definition |
|------|------------|
| **Tenant** | An independent store/business using the system |
| **Branch** | A physical location of a tenant |
| **SKU** | Stock Keeping Unit - unique product identifier |
| **POS** | Point of Sale - checkout system |
| **PWA** | Progressive Web App |
| **Sync** | Data synchronization between client and server |

### 8.2 Priority Legend
| Priority | Meaning |
|----------|---------|
| P0 | Must have - Critical for MVP |
| P1 | Should have - Important but not blocking |
| P2 | Nice to have - Can be deferred |
| P3 | Future consideration |

---

## 9. Related Documents

- [02_future_proof_architecture.md](./02_future_proof_architecture.md) - Future-Proof Architecture Guide
- [java_conventions.md](../conventions/java_conventions.md) - Java Backend Conventions
- [react_conventions.md](../conventions/react_conventions.md) - React/Next.js Frontend Conventions
