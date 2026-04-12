import Dexie, { Table } from 'dexie'

// Types for offline data
export interface OfflineProduct {
  id: string
  sku: string
  name: string
  description?: string
  price: number
  cost: number
  quantity: number
  categoryId?: string
  imageUrl?: string
  syncStatus: 'synced' | 'pending' | 'error'
  lastModified: number
  tenantId: string
}

export interface OfflineSale {
  id: string
  items: OfflineSaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  status: 'pending' | 'completed' | 'cancelled'
  syncStatus: 'synced' | 'pending' | 'error'
  createdAt: number
  tenantId: string
}

export interface OfflineSaleItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

export interface OfflineCustomer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  loyaltyPoints: number
  syncStatus: 'synced' | 'pending' | 'error'
  lastModified: number
  tenantId: string
}

export interface SyncQueue {
  id?: number
  entityType: 'product' | 'sale' | 'customer'
  entityId: string
  operation: 'create' | 'update' | 'delete'
  data: unknown
  attempts: number
  lastAttempt?: number
  error?: string
  createdAt: number
}

// Database class
export class RetailDatabase extends Dexie {
  products!: Table<OfflineProduct, string>
  sales!: Table<OfflineSale, string>
  customers!: Table<OfflineCustomer, string>
  syncQueue!: Table<SyncQueue, number>

  constructor() {
    super('RetailManagementDB')

    this.version(1).stores({
      products: 'id, sku, name, categoryId, syncStatus, tenantId, lastModified',
      sales: 'id, status, syncStatus, tenantId, createdAt',
      customers: 'id, email, phone, syncStatus, tenantId, lastModified',
      syncQueue: '++id, entityType, entityId, operation, createdAt',
    })
  }
}

// Singleton instance
export const db = new RetailDatabase()

// Helper functions
export async function clearDatabase(): Promise<void> {
  await db.products.clear()
  await db.sales.clear()
  await db.customers.clear()
  await db.syncQueue.clear()
}

export async function getPendingSyncCount(): Promise<number> {
  return db.syncQueue.count()
}

export async function addToSyncQueue(item: Omit<SyncQueue, 'id' | 'attempts' | 'createdAt'>): Promise<number> {
  return db.syncQueue.add({
    ...item,
    attempts: 0,
    createdAt: Date.now(),
  })
}

export async function getNextSyncItem(): Promise<SyncQueue | undefined> {
  return db.syncQueue.orderBy('createdAt').first()
}

export async function removeSyncItem(id: number): Promise<void> {
  await db.syncQueue.delete(id)
}

export async function markSyncItemFailed(id: number, error: string): Promise<void> {
  await db.syncQueue.update(id, {
    attempts: (await db.syncQueue.get(id))?.attempts ?? 0 + 1,
    lastAttempt: Date.now(),
    error,
  })
}
