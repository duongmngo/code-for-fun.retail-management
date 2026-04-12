# Offline Sync Module Tasks

## Overview
- **Phase**: 1 - Foundation (MVP)
- **Timeline**: Week 7-10
- **Status**: Not Started
- **Priority**: P0 (Critical)

---

## Backend Tasks

### Sync Infrastructure

#### Sync Version Tracking
- [ ] Add version/updatedAt column to all syncable entities
- [ ] Create SyncState entity:
  - entityType (products, stock, customers, etc.)
  - tenantId, branchId
  - lastSyncVersion (timestamp or version number)
  - lastFullSync

#### Change Tracking
- [ ] Implement @SyncAware annotation for entities
- [ ] Track entity changes with version increment
- [ ] Track soft deletes for sync

### Delta Sync Endpoints
- [ ] GET /api/v1/sync/products?since={timestamp}
- [ ] GET /api/v1/sync/categories?since={timestamp}
- [ ] GET /api/v1/sync/stock?since={timestamp}&warehouseId={id}
- [ ] GET /api/v1/sync/customers?since={timestamp}
- [ ] GET /api/v1/sync/settings?since={timestamp}
- [ ] Response format:
  ```json
  {
    "data": [...],
    "serverTime": "2024-01-15T10:30:00Z",
    "hasMore": false,
    "nextCursor": null
  }
  ```

### Offline Queue Processing
- [ ] POST /api/v1/sync/queue - Submit offline operations
- [ ] Implement operation validation
- [ ] Implement conflict detection
- [ ] Implement operation ordering
- [ ] Return results with conflicts

### Conflict Resolution
- [ ] Define conflict detection rules
- [ ] Implement server-wins for:
  - Product price changes
  - Stock levels
- [ ] Implement client-wins for:
  - New sales (always apply)
- [ ] Implement merge strategy for:
  - Customer updates (field-level merge)
- [ ] Return conflict details to client

### WebSocket Sync
- [ ] Implement /ws/sync endpoint
- [ ] Push real-time updates
- [ ] Push stock changes
- [ ] Push settings changes

### Testing
- [ ] Unit tests for delta sync logic
- [ ] Unit tests for conflict resolution
- [ ] Integration tests for sync endpoints
- [ ] Test concurrent syncs
- [ ] Test large batch syncs

---

## Frontend Tasks

### Core Infrastructure

#### IndexedDB Setup (Dexie.js)
- [ ] Configure Dexie database schema
  ```typescript
  db.version(1).stores({
    products: '++id, sku, name, categoryId, updatedAt',
    categories: '++id, name, parentId',
    stock: '++id, productId, variantId, warehouseId',
    customers: '++id, phone, name',
    settings: 'key',
    syncQueue: '++id, entityType, operation, createdAt',
    syncState: 'entityType'
  });
  ```
- [ ] Implement database versioning/migration
- [ ] Implement cleanup for old data

#### Service Worker
- [ ] Configure Workbox in Next.js
- [ ] Implement network-first for API calls
- [ ] Implement cache-first for assets
- [ ] Implement stale-while-revalidate for products
- [ ] Implement offline fallback page
- [ ] Handle service worker updates

### Sync Service
- [ ] Create SyncService class
- [ ] Implement initial full sync
- [ ] Implement delta sync (since timestamp)
- [ ] Implement sync scheduling
- [ ] Implement manual sync trigger
- [ ] Handle sync errors and retries

### Offline Queue
- [ ] Create OfflineQueueService
- [ ] Queue operations when offline:
  - Sales
  - Stock adjustments
  - Customer updates
- [ ] Store operation with:
  - Operation type
  - Entity type
  - Payload
  - Timestamp
  - Retry count
- [ ] Process queue when online
- [ ] Handle failures and retries
- [ ] Show pending queue count

### Network Status
- [ ] Create useNetworkStatus hook
- [ ] Detect online/offline
- [ ] Handle connection changes
- [ ] Trigger sync on reconnect
- [ ] Show connection status indicator

### Sync UI Components
- [ ] Create SyncStatusIndicator
  - Online/Offline status
  - Last synced time
  - Pending operations count
- [ ] Create SyncProgressDialog
- [ ] Create ConflictResolutionDialog
- [ ] Create SyncErrorAlert
- [ ] Create ManualSyncButton

### Data Access Layer
- [ ] Create offline-aware data hooks
- [ ] useProducts - fetch from IndexedDB first, then server
- [ ] useStock - local with real-time updates
- [ ] useCustomers - local with sync
- [ ] Implement optimistic updates
- [ ] Handle sync conflicts in UI

### Offline POS Integration
- [ ] Create sales offline when disconnected
- [ ] Store receipt data locally
- [ ] Queue for sync
- [ ] Generate temporary sale numbers
- [ ] Reconcile sale numbers on sync

### Image Caching
- [ ] Cache product images in service worker
- [ ] Implement lazy loading with placeholder
- [ ] Handle image sync
- [ ] Cleanup old images

### Testing
- [ ] Write tests for SyncService
- [ ] Write tests for OfflineQueue
- [ ] Test offline sale creation
- [ ] Test sync on reconnect
- [ ] Test conflict handling

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/sync/products | Sync products | Yes |
| GET | /api/v1/sync/categories | Sync categories | Yes |
| GET | /api/v1/sync/stock | Sync stock | Yes |
| GET | /api/v1/sync/customers | Sync customers | Yes |
| GET | /api/v1/sync/settings | Sync settings | Yes |
| POST | /api/v1/sync/queue | Process offline queue | Yes |
| GET | /api/v1/sync/status | Check sync status | Yes |

---

## Data Models

### DeltaSyncResponse
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Updated Product",
      "updatedAt": "2024-01-15T10:30:00Z",
      "_deleted": false
    }
  ],
  "serverTime": "2024-01-15T10:35:00Z",
  "syncedCount": 50,
  "hasMore": false,
  "nextCursor": null
}
```

### OfflineQueueItem
```json
{
  "id": "local-uuid",
  "entityType": "sale",
  "operation": "CREATE",
  "payload": {
    "items": [...],
    "payments": [...],
    "completedAt": "2024-01-15T10:30:00Z"
  },
  "clientTimestamp": "2024-01-15T10:30:00Z"
}
```

### SyncQueueResponse
```json
{
  "processed": [
    {
      "localId": "local-uuid",
      "serverId": "server-uuid",
      "status": "SUCCESS"
    }
  ],
  "conflicts": [
    {
      "localId": "local-uuid-2",
      "entityType": "customer",
      "conflictType": "CONCURRENT_UPDATE",
      "serverVersion": { ... },
      "clientVersion": { ... },
      "resolution": "SERVER_WINS"
    }
  ],
  "failed": []
}
```

---

## IndexedDB Schema

```typescript
// Dexie Schema Definition
interface RetailDB {
  products: Product[];
  categories: Category[];
  variants: ProductVariant[];
  stock: Stock[];
  customers: Customer[];
  settings: Setting[];
  syncQueue: SyncQueueItem[];
  syncState: SyncStateRecord[];
  pendingSales: PendingSale[];
}

// Indexes for efficient queries
{
  products: '&id, tenantId, sku, *tags, categoryId, updatedAt',
  categories: '&id, tenantId, parentId',
  stock: '&id, [variantId+warehouseId], warehouseId',
  customers: '&id, tenantId, phone, email',
  syncQueue: '++id, entityType, status, createdAt',
  syncState: '&entityType'
}
```

---

## Sync Strategy

### Initial Sync (First Time)
1. Full download of all products, categories
2. Full download of stock for user's warehouse(s)
3. Full download of customers (if applicable)
4. Store sync timestamp

### Delta Sync (Subsequent)
1. Request changes since last sync timestamp
2. Apply changes to local DB
3. Update sync timestamp
4. Paginate if large dataset

### Queue Processing
1. Collect all pending operations
2. Sort by timestamp (oldest first)
3. Submit batch to server
4. Handle responses:
   - SUCCESS: Remove from queue
   - CONFLICT: Show resolution UI or auto-resolve
   - FAILED: Retry with backoff

### Conflict Resolution Strategies
| Entity | Conflict Type | Resolution |
|--------|--------------|------------|
| Product | Price changed | Server wins |
| Stock | Quantity mismatch | Server wins + alert |
| Customer | Field changed | Merge fields |
| Sale | Duplicate | Always accept (dedupe by localId) |

---

## Acceptance Criteria

- [ ] App works fully offline after initial sync
- [ ] Sales can be created offline and sync when online
- [ ] Stock levels reflect offline sales locally
- [ ] App detects network status changes
- [ ] Sync happens automatically on reconnect
- [ ] User can trigger manual sync
- [ ] Conflicts are handled gracefully
- [ ] User is informed of sync status and pending items
- [ ] Service worker caches app assets for offline use

---

## Dependencies

- **Requires**: 03-product, 04-inventory, 05-pos

## Blocks

- None (this supports all other modules)
