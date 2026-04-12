# Reporting Module Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 8-10
- **Status**: Not Started
- **Priority**: P1 (High)

---

## Backend Tasks

### Core Report Infrastructure
- [ ] Create BaseReportService with common utilities
- [ ] Implement report query builders
- [ ] Implement pagination for large reports
- [ ] Implement caching for expensive queries
- [ ] Implement async report generation for large datasets

### Sales Reports

#### Daily Sales Summary
- [ ] Total sales count and amount
- [ ] Breakdown by payment method
- [ ] Average transaction value
- [ ] Compare to previous period

#### Sales by Period
- [ ] Daily, weekly, monthly, yearly grouping
- [ ] Revenue, quantity, profit margins
- [ ] Growth comparison

#### Sales by Product
- [ ] Top selling products (by quantity, revenue)
- [ ] Product performance over time
- [ ] Category breakdown

#### Sales by Staff
- [ ] Sales per cashier
- [ ] Transaction count
- [ ] Average transaction value

#### Sales by Customer
- [ ] Top customers
- [ ] Purchase frequency
- [ ] Customer lifetime value

#### Refund Report
- [ ] Refund count and total
- [ ] Refund rate percentage
- [ ] Top refunded products
- [ ] Refund reasons

### Inventory Reports

#### Stock on Hand
- [ ] Current stock levels
- [ ] Stock value (cost, retail)
- [ ] By warehouse, category

#### Low Stock Report
- [ ] Items below min threshold
- [ ] Days of supply estimate
- [ ] Reorder suggestions

#### Stock Movement Report
- [ ] Movements by type
- [ ] Movement history by product
- [ ] Stock adjustment summary

#### Stock Valuation
- [ ] Total inventory value
- [ ] Cost vs retail value
- [ ] By category, warehouse

### Financial Reports

#### Profit & Loss
- [ ] Revenue
- [ ] Cost of goods sold
- [ ] Gross profit
- [ ] By period

#### Cash Flow
- [ ] Cash sales
- [ ] Cash in drawer
- [ ] Cash variances

### Report Export
- [ ] Export to CSV
- [ ] Export to Excel (xlsx)
- [ ] Export to PDF
- [ ] Schedule email reports

### Report Scheduling
- [ ] Create scheduled report entity
- [ ] Implement cron-based execution
- [ ] Send via email
- [ ] Store in report history

### Caching & Performance
- [ ] Cache frequently accessed reports
- [ ] Pre-compute daily summaries (nightly job)
- [ ] Implement report materialized views

### Testing
- [ ] Unit tests for report calculations
- [ ] Test large dataset performance
- [ ] Test export formats
- [ ] Test scheduled reports

---

## Frontend Tasks

### Dashboard
- [ ] Create main dashboard (/dashboard)
- [ ] Today's sales summary card
- [ ] Sales trend chart (7 days)
- [ ] Top products widget
- [ ] Low stock alerts widget
- [ ] Quick action buttons

### Report Pages
- [ ] Create reports index page (/reports)
- [ ] Create sales report page (/reports/sales)
- [ ] Create inventory report page (/reports/inventory)
- [ ] Create financial report page (/reports/financial)

### Sales Report UI
- [ ] Date range selector
- [ ] Period grouping (day/week/month)
- [ ] Branch/warehouse filter
- [ ] Category filter
- [ ] Staff filter
- [ ] Sales summary cards
- [ ] Sales trend chart
- [ ] Product breakdown table
- [ ] Payment method breakdown

### Inventory Report UI
- [ ] Stock on hand table
- [ ] Low stock alerts list
- [ ] Stock movement history
- [ ] Stock trend chart
- [ ] Filters: warehouse, category, status

### Charts & Visualization
- [ ] Implement Recharts or Chart.js
- [ ] Line chart for trends
- [ ] Bar chart for comparisons
- [ ] Pie chart for breakdowns
- [ ] Data table with sorting

### Export & Print
- [ ] Export to CSV button
- [ ] Export to Excel button
- [ ] Export to PDF button
- [ ] Print optimized layout

### Report Scheduling UI
- [ ] Create schedule dialog
- [ ] Select report type
- [ ] Configure frequency
- [ ] Select recipients
- [ ] View scheduled reports

### Offline Dashboard
- [ ] Cache dashboard data
- [ ] Show cached data when offline
- [ ] Indicate data staleness

### Testing
- [ ] Test date range picker
- [ ] Test chart rendering
- [ ] Test export functionality
- [ ] E2E test report generation

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/reports/dashboard | Dashboard summary | Yes |
| GET | /api/v1/reports/sales/summary | Sales summary | Yes |
| GET | /api/v1/reports/sales/by-period | Sales by period | Yes |
| GET | /api/v1/reports/sales/by-product | Sales by product | Yes |
| GET | /api/v1/reports/sales/by-staff | Sales by staff | Yes |
| GET | /api/v1/reports/sales/by-customer | Sales by customer | Yes |
| GET | /api/v1/reports/inventory/stock | Stock on hand | Yes |
| GET | /api/v1/reports/inventory/low-stock | Low stock items | Yes |
| GET | /api/v1/reports/inventory/movements | Stock movements | Yes |
| GET | /api/v1/reports/inventory/valuation | Stock valuation | Yes |
| GET | /api/v1/reports/financial/pnl | Profit & Loss | Yes |
| POST | /api/v1/reports/export | Export report | Yes |
| POST | /api/v1/reports/schedule | Schedule report | Yes |
| GET | /api/v1/reports/scheduled | List scheduled | Yes |

---

## Data Models

### DashboardResponse
```json
{
  "date": "2024-01-15",
  "todaySales": {
    "count": 45,
    "revenue": 15000000,
    "profit": 5000000,
    "averageTransaction": 333333
  },
  "compareToPrevious": {
    "revenueChange": 12.5,
    "countChange": 8.3
  },
  "topProducts": [
    {
      "id": "uuid",
      "name": "Summer Dress",
      "quantitySold": 25,
      "revenue": 12500000
    }
  ],
  "lowStockAlerts": [
    {
      "id": "uuid",
      "name": "White T-Shirt - M",
      "currentStock": 3,
      "minStock": 10
    }
  ],
  "recentSales": [...]
}
```

### SalesSummaryResponse
```json
{
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-15"
  },
  "totalSales": 500,
  "totalRevenue": 250000000,
  "totalProfit": 75000000,
  "averageTransaction": 500000,
  "byPaymentMethod": [
    { "method": "Cash", "count": 300, "amount": 150000000 },
    { "method": "Card", "count": 200, "amount": 100000000 }
  ],
  "dailyBreakdown": [
    { "date": "2024-01-01", "sales": 35, "revenue": 17500000 }
  ]
}
```

### ReportExportRequest
```json
{
  "reportType": "SALES_SUMMARY",
  "format": "XLSX",
  "parameters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "branchId": "uuid"
  }
}
```

---

## Dashboard Widgets

| Widget | Description | Data Source |
|--------|-------------|-------------|
| Today's Sales | Sales count, revenue, avg | sales table |
| Sales Trend | 7-day line chart | sales aggregates |
| Top Products | Top 5 by revenue | sales items |
| Low Stock | Items below threshold | stock table |
| Recent Sales | Last 5 transactions | sales table |
| Payment Methods | Pie chart breakdown | payments table |

---

## Acceptance Criteria

- [ ] Dashboard loads within 2 seconds
- [ ] Sales reports filter by date, branch, category
- [ ] Charts display correctly on all screen sizes
- [ ] Reports export to CSV, Excel, PDF
- [ ] Low stock alerts show correct items
- [ ] Profit calculations are accurate
- [ ] Reports can be scheduled for email
- [ ] Dashboard shows cached data when offline
- [ ] Large reports paginate or async generate

---

## Dependencies

- **Requires**: 05-pos (sales data), 04-inventory (stock data)

## Blocks

- None (end of Phase 1)
