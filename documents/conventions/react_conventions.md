# React & Next.js Frontend - Coding Conventions & Project Structure

## Document Information
- **Version**: 1.0
- **Last Updated**: January 25, 2026
- **Applies To**: retail-management-web

---

## 1. Project Structure

```
retail-management-web/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── .husky/
│   ├── pre-commit
│   └── commit-msg
├── public/
│   ├── icons/                          # PWA icons
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── manifest.json                   # PWA manifest
│   └── sw.js                           # Service worker (generated)
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── (auth)/                     # Auth route group (no layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/                # Dashboard route group
│   │   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   │   ├── page.tsx                # Dashboard home
│   │   │   │
│   │   │   ├── products/
│   │   │   │   ├── page.tsx            # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx        # Create product
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx        # Product detail
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx    # Edit product
│   │   │   │   └── _components/        # Page-specific components
│   │   │   │       ├── ProductTable.tsx
│   │   │   │       └── ProductForm.tsx
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── stock-adjustment/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── stock-transfer/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── sales/
│   │   │   │   ├── page.tsx            # Sales list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Sale detail
│   │   │   │
│   │   │   ├── pos/
│   │   │   │   └── page.tsx            # POS terminal
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── sales/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── inventory/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── branches/
│   │   │       │   └── page.tsx
│   │   │       └── users/
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/                        # API routes (if needed)
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   ├── error.tsx                   # Global error boundary
│   │   ├── not-found.tsx               # 404 page
│   │   ├── loading.tsx                 # Global loading
│   │   ├── layout.tsx                  # Root layout
│   │   └── globals.css                 # Global styles
│   │
│   ├── components/                      # Shared components
│   │   ├── ui/                         # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                     # Layout components
│   │   │   ├── Sidebar/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── SidebarItem.tsx
│   │   │   │   └── SidebarItem.module.css
│   │   │   ├── Header/
│   │   │   │   └── index.tsx
│   │   │   └── Footer/
│   │   │       └── index.tsx
│   │   │
│   │   ├── common/                     # Common reusable components
│   │   │   ├── DataTable/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── DataTablePagination.tsx
│   │   │   │   └── DataTableToolbar.tsx
│   │   │   ├── BarcodeScanner/
│   │   │   │   └── index.tsx
│   │   │   ├── ConfirmDialog/
│   │   │   │   └── index.tsx
│   │   │   ├── EmptyState/
│   │   │   │   └── index.tsx
│   │   │   ├── LoadingSpinner/
│   │   │   │   └── index.tsx
│   │   │   └── OfflineIndicator/
│   │   │       └── index.tsx
│   │   │
│   │   └── providers/                  # Context providers
│   │       ├── AuthProvider.tsx
│   │       ├── ThemeProvider.tsx
│   │       ├── QueryProvider.tsx
│   │       └── OfflineProvider.tsx
│   │
│   ├── features/                       # Feature modules
│   │   ├── products/
│   │   │   ├── api/
│   │   │   │   └── productApi.ts       # API functions
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts      # React Query hooks
│   │   │   │   └── useProductForm.ts
│   │   │   ├── schemas/
│   │   │   │   └── productSchema.ts    # Zod schemas
│   │   │   ├── types/
│   │   │   │   └── index.ts            # TypeScript types
│   │   │   └── utils/
│   │   │       └── productHelpers.ts
│   │   │
│   │   ├── inventory/
│   │   │   └── ... (same structure)
│   │   │
│   │   ├── sales/
│   │   │   └── ... (same structure)
│   │   │
│   │   ├── pos/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   │   └── cartStore.ts        # Zustand store
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   └── auth/
│   │       └── ... (same structure)
│   │
│   ├── hooks/                          # Global hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useOnlineStatus.ts
│   │   └── useBarcodeScanner.ts
│   │
│   ├── lib/                            # Utilities & configurations
│   │   ├── api/
│   │   │   ├── client.ts               # Axios/fetch client
│   │   │   └── interceptors.ts
│   │   ├── db/
│   │   │   ├── dexie.ts                # IndexedDB setup
│   │   │   └── schemas.ts              # DB schemas
│   │   ├── sync/
│   │   │   ├── syncManager.ts          # Sync logic
│   │   │   └── conflictResolver.ts
│   │   ├── utils/
│   │   │   ├── cn.ts                   # Class names utility
│   │   │   ├── formatters.ts           # Date, currency formatters
│   │   │   └── validators.ts
│   │   └── constants/
│   │       ├── routes.ts
│   │       ├── permissions.ts
│   │       └── config.ts
│   │
│   ├── stores/                         # Global Zustand stores
│   │   ├── authStore.ts
│   │   ├── settingsStore.ts
│   │   └── syncStore.ts
│   │
│   ├── types/                          # Global TypeScript types
│   │   ├── api.ts                      # API response types
│   │   ├── auth.ts
│   │   └── common.ts
│   │
│   └── styles/                         # Global styles
│       └── themes/
│           └── default.css
│
├── tests/
│   ├── __mocks__/
│   ├── e2e/                            # Playwright tests
│   │   └── pos.spec.ts
│   └── unit/                           # Vitest tests
│       └── components/
│
├── .env.local
├── .env.development
├── .env.production
├── .eslintrc.json
├── .prettierrc
├── components.json                      # shadcn/ui config
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 2. Naming Conventions

### 2.1 Files & Folders

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `ProductCard.tsx`, `BarcodeScanner.tsx` |
| Component folders | PascalCase | `ProductCard/index.tsx` |
| Hooks | camelCase with `use` prefix | `useProducts.ts`, `useDebounce.ts` |
| Utilities | camelCase | `formatCurrency.ts`, `validators.ts` |
| Types | camelCase | `product.ts`, `api.ts` |
| Constants | camelCase | `routes.ts`, `config.ts` |
| Stores (Zustand) | camelCase with `Store` suffix | `authStore.ts`, `cartStore.ts` |
| Schemas (Zod) | camelCase with `Schema` suffix | `productSchema.ts` |
| API files | camelCase with `Api` suffix | `productApi.ts` |
| Test files | Same as source with `.test` or `.spec` | `ProductCard.test.tsx` |
| CSS Modules | camelCase | `ProductCard.module.css` |

### 2.2 Component Naming

```tsx
// ✅ Good - PascalCase, descriptive names
function ProductCard({ product }: ProductCardProps) { ... }
function BarcodeScanner({ onScan }: BarcodeScannerProps) { ... }
function DataTablePagination({ table }: DataTablePaginationProps) { ... }

// ❌ Bad
function productCard() { ... }  // Not PascalCase
function Card() { ... }         // Too generic
function PC() { ... }           // Abbreviation
```

### 2.3 Props & Types

```tsx
// Component props - ComponentNameProps
interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

// Event handlers - onEventName
interface Props {
  onClick: () => void;
  onChange: (value: string) => void;
  onSubmit: (data: FormData) => Promise<void>;
}

// Boolean props - is/has/can/should prefix
interface Props {
  isLoading: boolean;
  isDisabled: boolean;
  hasError: boolean;
  canEdit: boolean;
  shouldValidate: boolean;
}

// Render props - renderItemName
interface Props {
  renderHeader?: () => ReactNode;
  renderFooter?: () => ReactNode;
  renderItem: (item: Item) => ReactNode;
}
```

### 2.4 Variables & Functions

```tsx
// camelCase for variables
const productList = [];
const isLoading = true;
const currentUser = useAuth();

// camelCase for functions
function calculateTotal(items: CartItem[]): number { ... }
function formatCurrency(amount: number): string { ... }

// UPPER_SNAKE_CASE for constants
const MAX_ITEMS_PER_PAGE = 50;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_CURRENCY = 'VND';

// Event handlers - handleEventName
const handleClick = () => { ... };
const handleSubmit = async (data: FormData) => { ... };
const handleBarcodeScanned = (barcode: string) => { ... };
```

---

## 3. Component Guidelines

### 3.1 Component Structure

```tsx
// src/components/common/ProductCard/index.tsx

import { memo, useCallback } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/features/products/types';

// 1. Types/Interfaces at the top
interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

// 2. Component definition
function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: ProductCardProps) {
  // 3. Hooks first
  const { id, name, sellingPrice, stockQuantity, isLowStock } = product;
  
  // 4. Callbacks
  const handleEdit = useCallback(() => {
    onEdit?.(id);
  }, [id, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(id);
  }, [id, onDelete]);

  // 5. Early returns for loading/error states
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  // 6. Main render
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(sellingPrice)}
          </p>
        </div>
        {isLowStock && (
          <Badge variant="destructive">Low Stock</Badge>
        )}
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleEdit}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

// 7. Sub-components (if small and tightly coupled)
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-card p-4">
      <div className="h-4 w-3/4 bg-muted rounded" />
      <div className="h-6 w-1/2 bg-muted rounded mt-2" />
    </div>
  );
}

// 8. Export (with memo if needed)
export default memo(ProductCard);

// 9. Named exports for sub-components if needed
export { ProductCardSkeleton };
```

### 3.2 Page Component Structure

```tsx
// src/app/(dashboard)/products/page.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductTable } from './_components/ProductTable';
import { ProductTableSkeleton } from './_components/ProductTableSkeleton';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Products | Retail Management',
  description: 'Manage your product catalog',
};

// Page component (Server Component by default in App Router)
export default function ProductsPage() {
  return (
    <div className="container py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <AddProductButton />
      </div>

      {/* Content with Suspense boundary */}
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTable />
      </Suspense>
    </div>
  );
}
```

### 3.3 Form Component Pattern

```tsx
// src/app/(dashboard)/products/_components/ProductForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productSchema, type ProductFormData } from '@/features/products/schemas/productSchema';
import { useCreateProduct, useUpdateProduct } from '@/features/products/hooks/useProducts';

interface ProductFormProps {
  initialData?: ProductFormData;
  productId?: string;
  onSuccess?: () => void;
}

export function ProductForm({ 
  initialData, 
  productId, 
  onSuccess 
}: ProductFormProps) {
  const isEditing = !!productId;
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? {
      name: '',
      barcode: '',
      sellingPrice: 0,
      costPrice: 0,
      stockQuantity: 0,
      reorderLevel: 10,
    },
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing) {
        await updateProduct.mutateAsync({ id: productId, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="Scan or enter barcode" {...field} />
                  <BarcodeScanner onScan={(code) => field.onChange(code)} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## 4. State Management

### 4.1 Server State (React Query / TanStack Query)

```tsx
// src/features/products/api/productApi.ts

import { apiClient } from '@/lib/api/client';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const productApi = {
  getAll: async (params?: ProductFilterParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getByBarcode: async (barcode: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get(`/products/barcode/${barcode}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

// src/features/products/hooks/useProducts.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { productKeys } from './queryKeys';
import { toast } from 'sonner';

// Query keys factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilterParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  barcode: (barcode: string) => [...productKeys.all, 'barcode', barcode] as const,
};

// Queries
export function useProducts(filters?: ProductFilterParams) {
  return useQuery({
    queryKey: productKeys.list(filters ?? {}),
    queryFn: () => productApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
}

export function useProductByBarcode(barcode: string) {
  return useQuery({
    queryKey: productKeys.barcode(barcode),
    queryFn: () => productApi.getByBarcode(barcode),
    enabled: !!barcode,
    retry: false,
  });
}

// Mutations
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
}
```

### 4.2 Client State (Zustand)

```tsx
// src/features/pos/store/cartStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Product } from '@/features/products/types';

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

interface CartState {
  items: CartItem[];
  customerId: string | null;
  discount: number;
  note: string;
}

interface CartActions {
  // Item operations
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItemDiscount: (productId: string, discount: number) => void;
  
  // Cart operations
  setCustomer: (customerId: string | null) => void;
  setDiscount: (discount: number) => void;
  setNote: (note: string) => void;
  clearCart: () => void;
  
  // Computed values (using selectors is preferred, but can be methods too)
  getSubtotal: () => number;
  getTotalDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const initialState: CartState = {
  items: [],
  customerId: null,
  discount: 0,
  note: '',
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.items.push({
              product,
              quantity,
              discount: 0,
            });
          }
        });
      },

      removeItem: (productId) => {
        set((state) => {
          state.items = state.items.filter(
            (item) => item.product.id !== productId
          );
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.items.find(
            (item) => item.product.id === productId
          );
          if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
              state.items = state.items.filter(
                (i) => i.product.id !== productId
              );
            }
          }
        });
      },

      setItemDiscount: (productId, discount) => {
        set((state) => {
          const item = state.items.find(
            (item) => item.product.id === productId
          );
          if (item) {
            item.discount = Math.max(0, Math.min(100, discount));
          }
        });
      },

      setCustomer: (customerId) => {
        set({ customerId });
      },

      setDiscount: (discount) => {
        set({ discount: Math.max(0, Math.min(100, discount)) });
      },

      setNote: (note) => {
        set({ note });
      },

      clearCart: () => {
        set(initialState);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const itemTotal = item.product.sellingPrice * item.quantity;
          const itemDiscount = itemTotal * (item.discount / 100);
          return sum + itemTotal - itemDiscount;
        }, 0);
      },

      getTotalDiscount: () => {
        const subtotal = get().getSubtotal();
        return subtotal * (get().discount / 100);
      },

      getTotal: () => {
        return get().getSubtotal() - get().getTotalDiscount();
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    })),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        customerId: state.customerId,
        discount: state.discount,
        note: state.note,
      }),
    }
  )
);

// Selectors (for optimized re-renders)
export const selectCartItems = (state: CartState) => state.items;
export const selectCartItemCount = (state: CartState & CartActions) => state.getItemCount();
export const selectCartTotal = (state: CartState & CartActions) => state.getTotal();
```

---

## 5. Offline-First & PWA Implementation

### 5.1 IndexedDB Setup (Dexie.js)

```tsx
// src/lib/db/dexie.ts

import Dexie, { type Table } from 'dexie';
import type { Product, Sale, SyncQueueItem } from '@/types';

export class RetailDatabase extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  syncQueue!: Table<SyncQueueItem>;
  settings!: Table<{ key: string; value: any }>;

  constructor() {
    super('RetailManagementDB');
    
    this.version(1).stores({
      products: 'id, barcode, categoryId, [tenantId+barcode], updatedAt',
      sales: 'id, branchId, status, createdAt, [branchId+createdAt]',
      syncQueue: '++id, entity, action, status, createdAt',
      settings: 'key',
    });
  }
}

export const db = new RetailDatabase();

// Typed helper functions
export async function getProductByBarcode(barcode: string): Promise<Product | undefined> {
  return db.products.where('barcode').equals(barcode).first();
}

export async function saveProduct(product: Product): Promise<void> {
  await db.products.put(product);
}

export async function saveSale(sale: Sale): Promise<void> {
  await db.sales.put(sale);
  // Add to sync queue if offline
  if (!navigator.onLine) {
    await db.syncQueue.add({
      entity: 'sales',
      entityId: sale.id,
      action: 'create',
      data: sale,
      status: 'pending',
      createdAt: new Date().toISOString(),
      retryCount: 0,
    });
  }
}
```

### 5.2 Sync Manager

```tsx
// src/lib/sync/syncManager.ts

import { db } from '@/lib/db/dexie';
import { apiClient } from '@/lib/api/client';
import type { SyncQueueItem, SyncResult } from '@/types';

class SyncManager {
  private isSyncing = false;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  async sync(): Promise<SyncResult> {
    if (this.isSyncing || !navigator.onLine) {
      return { success: false, synced: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.notifyListeners({ status: 'syncing' });

    try {
      // Get pending items
      const pendingItems = await db.syncQueue
        .where('status')
        .equals('pending')
        .toArray();

      let synced = 0;
      let failed = 0;

      for (const item of pendingItems) {
        try {
          await this.syncItem(item);
          await db.syncQueue.delete(item.id!);
          synced++;
        } catch (error) {
          failed++;
          await this.handleSyncError(item, error);
        }
      }

      // Pull latest data from server
      await this.pullServerData();

      this.notifyListeners({ status: 'idle', lastSyncAt: new Date() });
      return { success: true, synced, failed };
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const endpoints: Record<string, Record<string, string>> = {
      sales: {
        create: '/sales',
        update: '/sales',
      },
      products: {
        create: '/products',
        update: '/products',
      },
    };

    const endpoint = endpoints[item.entity]?.[item.action];
    if (!endpoint) {
      throw new Error(`Unknown sync action: ${item.entity}.${item.action}`);
    }

    if (item.action === 'create') {
      await apiClient.post(endpoint, item.data);
    } else if (item.action === 'update') {
      await apiClient.put(`${endpoint}/${item.entityId}`, item.data);
    } else if (item.action === 'delete') {
      await apiClient.delete(`${endpoint}/${item.entityId}`);
    }
  }

  private async handleSyncError(item: SyncQueueItem, error: unknown): Promise<void> {
    const maxRetries = 3;
    
    if (item.retryCount >= maxRetries) {
      await db.syncQueue.update(item.id!, { 
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } else {
      await db.syncQueue.update(item.id!, {
        retryCount: item.retryCount + 1,
        lastAttempt: new Date().toISOString(),
      });
    }
  }

  private async pullServerData(): Promise<void> {
    // Get last sync timestamp from settings
    const lastSync = await db.settings.get('lastProductSync');
    const since = lastSync?.value;

    // Fetch updated products
    const response = await apiClient.get('/products/sync', {
      params: { since },
    });

    // Update local database
    if (response.data.data?.length) {
      await db.products.bulkPut(response.data.data);
    }

    // Update last sync timestamp
    await db.settings.put({ 
      key: 'lastProductSync', 
      value: new Date().toISOString() 
    });
  }

  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(status: SyncStatus): void {
    this.listeners.forEach((listener) => listener(status));
  }
}

export const syncManager = new SyncManager();

// Hook for components
export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>({ status: 'idle' });

  useEffect(() => {
    return syncManager.subscribe(setStatus);
  }, []);

  return status;
}
```

### 5.2.1 Offline Awareness Components

```tsx
// src/components/common/OfflineIndicator/index.tsx

'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSyncStatus } from '@/lib/sync/syncManager';
import { useSyncStore } from '@/stores/syncStore';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils/cn';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const syncStatus = useSyncStatus();
  const { pendingItems, failedItems, triggerSync } = useSyncStore();

  const pendingCount = pendingItems.length;
  const failedCount = failedItems.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-2 px-3',
            !isOnline && 'bg-destructive/10 text-destructive',
            syncStatus.status === 'syncing' && 'bg-yellow-500/10 text-yellow-600'
          )}
        >
          {/* Status Icon */}
          {!isOnline ? (
            <WifiOff className="h-4 w-4" />
          ) : syncStatus.status === 'syncing' ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Wifi className="h-4 w-4 text-green-500" />
          )}

          {/* Status Text */}
          <span className="hidden sm:inline">
            {!isOnline ? 'Offline' : syncStatus.status === 'syncing' ? 'Syncing...' : 'Online'}
          </span>

          {/* Pending Badge */}
          {pendingCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {pendingCount}
            </Badge>
          )}

          {/* Failed Badge */}
          {failedCount > 0 && (
            <Badge variant="destructive" className="ml-1">
              {failedCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <SyncStatusPanel />
      </PopoverContent>
    </Popover>
  );
}

function SyncStatusPanel() {
  const isOnline = useOnlineStatus();
  const syncStatus = useSyncStatus();
  const { pendingItems, failedItems, triggerSync, retryFailed, clearFailed } = useSyncStore();

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-destructive" />
          )}
          <span className="font-medium">
            {isOnline ? 'Connected' : 'No Connection'}
          </span>
        </div>
        {isOnline && syncStatus.lastSyncAt && (
          <span className="text-xs text-muted-foreground">
            Last sync: {formatRelativeTime(syncStatus.lastSyncAt)}
          </span>
        )}
      </div>

      {/* Sync Progress */}
      {syncStatus.status === 'syncing' && syncStatus.progress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Syncing...</span>
            <span>{syncStatus.progress.current} / {syncStatus.progress.total}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ 
                width: `${(syncStatus.progress.current / syncStatus.progress.total) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Pending ({pendingItems.length})</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {pendingItems.slice(0, 5).map((item) => (
              <PendingItemRow key={item.id} item={item} />
            ))}
            {pendingItems.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{pendingItems.length - 5} more items
              </p>
            )}
          </div>
        </div>
      )}

      {/* Failed Items */}
      {failedItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-destructive">
            Failed ({failedItems.length})
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {failedItems.map((item) => (
              <FailedItemRow key={item.id} item={item} />
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={retryFailed}>
              Retry All
            </Button>
            <Button size="sm" variant="ghost" onClick={clearFailed}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Manual Sync Button */}
      {isOnline && (
        <Button 
          className="w-full" 
          onClick={triggerSync}
          disabled={syncStatus.status === 'syncing'}
        >
          {syncStatus.status === 'syncing' ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
      )}

      {/* Offline Message */}
      {!isOnline && (
        <p className="text-sm text-muted-foreground text-center">
          Changes will sync when you're back online
        </p>
      )}
    </div>
  );
}

function PendingItemRow({ item }: { item: SyncQueueItem }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <div className="flex items-center gap-2">
        <span className="capitalize">{item.entity}</span>
        <span className="text-muted-foreground">#{item.entityId.slice(0, 8)}</span>
      </div>
      <span className="text-xs text-muted-foreground">
        {formatRelativeTime(new Date(item.createdAt))}
      </span>
    </div>
  );
}

function FailedItemRow({ item }: { item: SyncQueueItem }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="capitalize">{item.entity}</span>
          <span className="text-muted-foreground">#{item.entityId.slice(0, 8)}</span>
        </div>
        {item.error && (
          <span className="text-xs text-destructive">{item.error}</span>
        )}
      </div>
      <Badge variant="outline" className="text-xs">
        {item.retryCount} retries
      </Badge>
    </div>
  );
}
```

### 5.2.2 Connection State Hook

```tsx
// src/hooks/useOnlineStatus.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    toast.success('Back online! Syncing changes...', {
      id: 'connection-status',
    });
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    toast.warning('You\'re offline. Changes will sync when connected.', {
      id: 'connection-status',
      duration: 5000,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return isOnline;
}
```

### 5.2.3 Sync Store (Zustand)

```tsx
// src/stores/syncStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncManager, type SyncStatus } from '@/lib/sync/syncManager';
import type { SyncQueueItem } from '@/types';

interface SyncState {
  pendingItems: SyncQueueItem[];
  failedItems: SyncQueueItem[];
  lastSyncAt: Date | null;
}

interface SyncActions {
  addPendingItem: (item: SyncQueueItem) => void;
  removePendingItem: (id: number) => void;
  markAsFailed: (id: number, error: string) => void;
  triggerSync: () => Promise<void>;
  retryFailed: () => Promise<void>;
  clearFailed: () => void;
  refreshFromDb: () => Promise<void>;
}

export const useSyncStore = create<SyncState & SyncActions>()(
  persist(
    (set, get) => ({
      pendingItems: [],
      failedItems: [],
      lastSyncAt: null,

      addPendingItem: (item) => {
        set((state) => ({
          pendingItems: [...state.pendingItems, item],
        }));
      },

      removePendingItem: (id) => {
        set((state) => ({
          pendingItems: state.pendingItems.filter((item) => item.id !== id),
        }));
      },

      markAsFailed: (id, error) => {
        set((state) => {
          const item = state.pendingItems.find((i) => i.id === id);
          if (!item) return state;

          return {
            pendingItems: state.pendingItems.filter((i) => i.id !== id),
            failedItems: [...state.failedItems, { ...item, error, status: 'failed' }],
          };
        });
      },

      triggerSync: async () => {
        const result = await syncManager.sync();
        if (result.success) {
          set({ lastSyncAt: new Date() });
          await get().refreshFromDb();
        }
      },

      retryFailed: async () => {
        const { failedItems } = get();
        // Move failed items back to pending
        set((state) => ({
          pendingItems: [
            ...state.pendingItems,
            ...state.failedItems.map((item) => ({
              ...item,
              status: 'pending' as const,
              retryCount: (item.retryCount || 0) + 1,
            })),
          ],
          failedItems: [],
        }));
        // Trigger sync
        await get().triggerSync();
      },

      clearFailed: () => {
        set({ failedItems: [] });
      },

      refreshFromDb: async () => {
        const { db } = await import('@/lib/db/dexie');
        const pending = await db.syncQueue.where('status').equals('pending').toArray();
        const failed = await db.syncQueue.where('status').equals('failed').toArray();
        set({ pendingItems: pending, failedItems: failed });
      },
    }),
    {
      name: 'sync-store',
      partialize: (state) => ({
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);
```

### 5.2.4 Data Freshness Indicator

```tsx
// src/components/common/DataFreshnessIndicator/index.tsx

'use client';

import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DataFreshnessIndicatorProps {
  lastUpdated: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  staleThresholdMinutes?: number;
  criticalThresholdMinutes?: number;
}

export function DataFreshnessIndicator({
  lastUpdated,
  onRefresh,
  isRefreshing = false,
  staleThresholdMinutes = 30,
  criticalThresholdMinutes = 120,
}: DataFreshnessIndicatorProps) {
  if (!lastUpdated) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <span>Never synced</span>
        {onRefresh && (
          <Button size="sm" variant="ghost" onClick={onRefresh}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  const minutesAgo = (Date.now() - lastUpdated.getTime()) / (1000 * 60);
  const isStale = minutesAgo > staleThresholdMinutes;
  const isCritical = minutesAgo > criticalThresholdMinutes;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            {isCritical ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : isStale ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            <span className={cn(
              'text-muted-foreground',
              isCritical && 'text-destructive',
              isStale && !isCritical && 'text-yellow-600'
            )}>
              Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last synced: {lastUpdated.toLocaleString()}</p>
          {isStale && <p className="text-yellow-500">Data may be outdated</p>}
        </TooltipContent>
      </Tooltip>

      {onRefresh && (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
        </Button>
      )}
    </div>
  );
}
```

### 5.2.5 Conflict Resolution Dialog

```tsx
// src/components/common/ConflictResolutionDialog/index.tsx

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ConflictData<T> {
  field: keyof T;
  localValue: any;
  serverValue: any;
  label: string;
}

interface ConflictResolutionDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityName: string;
  conflicts: ConflictData<T>[];
  onResolve: (resolution: 'local' | 'server' | 'merge', mergedData?: Partial<T>) => void;
}

export function ConflictResolutionDialog<T>({
  open,
  onOpenChange,
  entityType,
  entityName,
  conflicts,
  onResolve,
}: ConflictResolutionDialogProps<T>) {
  const [selectedValues, setSelectedValues] = useState<Record<string, 'local' | 'server'>>({});

  const handleFieldSelect = (field: string, source: 'local' | 'server') => {
    setSelectedValues((prev) => ({ ...prev, [field]: source }));
  };

  const handleMerge = () => {
    const mergedData: Partial<T> = {};
    conflicts.forEach((conflict) => {
      const selection = selectedValues[conflict.field as string] || 'server';
      (mergedData as any)[conflict.field] = 
        selection === 'local' ? conflict.localValue : conflict.serverValue;
    });
    onResolve('merge', mergedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Sync Conflict Detected
          </DialogTitle>
          <DialogDescription>
            {entityType} "{entityName}" was modified both locally and on the server.
            Choose how to resolve the conflict.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Conflict Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Field</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    <div className="flex items-center gap-2">
                      Your Changes
                      <Badge variant="outline">Local</Badge>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    <div className="flex items-center gap-2">
                      Server Version
                      <Badge variant="secondary">Remote</Badge>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {conflicts.map((conflict) => (
                  <tr key={conflict.field as string} className="border-t">
                    <td className="px-4 py-3 text-sm font-medium">
                      {conflict.label}
                    </td>
                    <td 
                      className={cn(
                        'px-4 py-3 text-sm cursor-pointer transition-colors',
                        selectedValues[conflict.field as string] === 'local' 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : 'hover:bg-muted/50'
                      )}
                      onClick={() => handleFieldSelect(conflict.field as string, 'local')}
                    >
                      <div className="flex items-center justify-between">
                        <span>{formatValue(conflict.localValue)}</span>
                        {selectedValues[conflict.field as string] === 'local' && (
                          <Badge variant="default" className="ml-2">Selected</Badge>
                        )}
                      </div>
                    </td>
                    <td 
                      className={cn(
                        'px-4 py-3 text-sm cursor-pointer transition-colors',
                        selectedValues[conflict.field as string] === 'server' 
                          ? 'bg-blue-50 dark:bg-blue-900/20' 
                          : 'hover:bg-muted/50'
                      )}
                      onClick={() => handleFieldSelect(conflict.field as string, 'server')}
                    >
                      <div className="flex items-center justify-between">
                        <span>{formatValue(conflict.serverValue)}</span>
                        {selectedValues[conflict.field as string] === 'server' && (
                          <Badge variant="secondary" className="ml-2">Selected</Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onResolve('local')}>
            Keep All Local Changes
          </Button>
          <Button variant="outline" onClick={() => onResolve('server')}>
            Accept Server Version
          </Button>
          <Button onClick={handleMerge}>
            Merge Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return value.toLocaleString();
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}
```

### 5.2.6 Logout Warning for Pending Sync

```tsx
// src/components/common/LogoutConfirmation/index.tsx

'use client';

import { useSyncStore } from '@/stores/syncStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface LogoutConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutConfirmation({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmationProps) {
  const { pendingItems } = useSyncStore();
  const hasPendingItems = pendingItems.length > 0;

  if (!hasPendingItems) {
    // No pending items, proceed directly
    if (open) {
      onConfirm();
    }
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Unsaved Changes
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              You have <strong>{pendingItems.length}</strong> changes that haven't 
              been synced to the server yet.
            </p>
            <p>
              If you log out now, these changes will be lost. Are you sure you 
              want to continue?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay Logged In</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Logout Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

```js
// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.retailmanagement\.com\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
};

module.exports = withPWA(nextConfig);
```

```json
// public/manifest.json

{
  "name": "Retail Management",
  "short_name": "RetailMgmt",
  "description": "Manage your retail store - inventory, sales, and more",
  "theme_color": "#0066FF",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "any",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 6. Barcode Scanner Integration

### 6.1 Barcode Scanner Hook

```tsx
// src/hooks/useBarcodeScanner.ts

import { useEffect, useCallback, useRef } from 'react';

interface BarcodeScannerOptions {
  onScan: (barcode: string) => void;
  minLength?: number;
  maxDelay?: number;
  enabled?: boolean;
}

export function useBarcodeScanner({
  onScan,
  minLength = 4,
  maxDelay = 50,
  enabled = true,
}: BarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const currentTime = Date.now();
      
      // Reset buffer if too much time has passed (typing manually)
      if (currentTime - lastKeyTimeRef.current > maxDelay) {
        bufferRef.current = '';
      }
      
      lastKeyTimeRef.current = currentTime;

      // Handle Enter key (barcode scanners typically send Enter at the end)
      if (event.key === 'Enter') {
        if (bufferRef.current.length >= minLength) {
          onScan(bufferRef.current);
        }
        bufferRef.current = '';
        return;
      }

      // Ignore non-printable characters
      if (event.key.length === 1) {
        bufferRef.current += event.key;
      }
    },
    [onScan, minLength, maxDelay, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [handleKeyPress, enabled]);
}
```

### 6.2 Camera-Based Barcode Scanner Component

```tsx
// src/components/common/BarcodeScanner/index.tsx

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  buttonLabel?: string;
}

export function BarcodeScanner({ onScan, buttonLabel = 'Scan' }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleScan = useCallback(
    (decodedText: string) => {
      onScan(decodedText);
      setIsOpen(false);
    },
    [onScan]
  );

  useEffect(() => {
    if (!isOpen) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      aspectRatio: 1.7777778,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };

    scannerRef.current = new Html5QrcodeScanner('barcode-scanner', config, false);

    scannerRef.current.render(handleScan, (errorMessage) => {
      // Ignore errors from scanning - they're expected when no barcode is visible
      console.debug('Scan error:', errorMessage);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isOpen, handleScan]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        title={buttonLabel}
      >
        <Camera className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <div id="barcode-scanner" className="w-full" />
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## 7. TypeScript Guidelines

### 7.1 Type Definitions

```tsx
// src/types/api.ts

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  errorCode?: string;
  data: T;
  timestamp: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

// Error Response
export interface ApiError {
  success: false;
  errorCode: string;
  message: string;
  timestamp: string;
  details?: Record<string, string>;
}

// src/features/products/types/index.ts

export interface Product {
  id: string;
  tenantId: string;
  sku: string | null;
  barcode: string | null;
  name: string;
  description: string | null;
  costPrice: number | null;
  sellingPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  isActive: boolean;
  isLowStock: boolean;
  category: Category | null;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  sku?: string;
  barcode?: string;
  name: string;
  description?: string;
  costPrice?: number;
  sellingPrice: number;
  initialStock?: number;
  reorderLevel?: number;
  categoryId?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  isLowStock?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
```

### 7.2 Zod Schemas

```tsx
// src/features/products/schemas/productSchema.ts

import { z } from 'zod';

export const productSchema = z.object({
  sku: z
    .string()
    .max(50, 'SKU must not exceed 50 characters')
    .optional()
    .nullable(),
  
  barcode: z
    .string()
    .max(100, 'Barcode must not exceed 100 characters')
    .optional()
    .nullable(),
  
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .nullable(),
  
  costPrice: z
    .number()
    .positive('Cost price must be positive')
    .optional()
    .nullable(),
  
  sellingPrice: z
    .number()
    .positive('Selling price must be positive'),
  
  stockQuantity: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .default(0),
  
  reorderLevel: z
    .number()
    .int('Reorder level must be a whole number')
    .min(0, 'Reorder level cannot be negative')
    .default(10),
  
  categoryId: z.string().uuid().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// For partial updates
export const updateProductSchema = productSchema.partial();
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
```

---

## 8. Testing Guidelines

### 8.1 Unit Testing with Vitest

```tsx
// tests/unit/components/ProductCard.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/common/ProductCard';
import type { Product } from '@/features/products/types';

const mockProduct: Product = {
  id: '1',
  tenantId: 'tenant-1',
  sku: 'SKU001',
  barcode: '1234567890123',
  name: 'Test Product',
  description: 'Test description',
  costPrice: 50,
  sellingPrice: 100,
  stockQuantity: 10,
  reorderLevel: 5,
  isActive: true,
  isLowStock: false,
  category: null,
  images: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('shows low stock badge when product is low stock', () => {
    const lowStockProduct = { ...mockProduct, isLowStock: true };
    render(<ProductCard product={lowStockProduct} />);
    
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<ProductCard product={mockProduct} onEdit={handleEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(handleEdit).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<ProductCard product={mockProduct} onDelete={handleDelete} />);
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(handleDelete).toHaveBeenCalledWith('1');
  });
});
```

### 8.2 E2E Testing with Playwright

```tsx
// tests/e2e/pos.spec.ts

import { test, expect } from '@playwright/test';

test.describe('POS Terminal', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to POS
    await page.click('text=POS');
    await page.waitForURL('/pos');
  });

  test('should add product to cart by barcode', async ({ page }) => {
    // Simulate barcode scan (keyboard input)
    await page.keyboard.type('1234567890123');
    await page.keyboard.press('Enter');

    // Check product is added to cart
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="cart-total"]')).not.toHaveText('0');
  });

  test('should complete a sale', async ({ page }) => {
    // Add product
    await page.keyboard.type('1234567890123');
    await page.keyboard.press('Enter');

    // Click pay button
    await page.click('[data-testid="pay-button"]');

    // Select cash payment
    await page.click('[data-testid="payment-cash"]');

    // Enter amount
    await page.fill('[data-testid="cash-amount"]', '100000');

    // Complete sale
    await page.click('[data-testid="complete-sale"]');

    // Verify success
    await expect(page.locator('[data-testid="sale-success"]')).toBeVisible();
  });

  test('should work offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Add product (should work from IndexedDB)
    await page.keyboard.type('1234567890123');
    await page.keyboard.press('Enter');

    // Check offline indicator is shown
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();

    // Complete sale
    await page.click('[data-testid="pay-button"]');
    await page.click('[data-testid="payment-cash"]');
    await page.fill('[data-testid="cash-amount"]', '100000');
    await page.click('[data-testid="complete-sale"]');

    // Verify sale was saved locally
    await expect(page.locator('[data-testid="sale-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="pending-sync-badge"]')).toHaveText('1');
  });
});
```

---

## 9. Performance Best Practices

### 9.1 Component Optimization

```tsx
// Use memo for expensive computations
import { useMemo, memo, useCallback } from 'react';

// Memoize expensive list rendering
const ProductList = memo(function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});

// Memoize computed values
function SalesReport({ sales }: { sales: Sale[] }) {
  const stats = useMemo(() => ({
    total: sales.reduce((sum, s) => sum + s.total, 0),
    count: sales.length,
    average: sales.length > 0 
      ? sales.reduce((sum, s) => sum + s.total, 0) / sales.length 
      : 0,
  }), [sales]);

  return <StatsDisplay stats={stats} />;
}

// Memoize callbacks passed to children
function ParentComponent() {
  const [items, setItems] = useState<Item[]>([]);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return <ItemList items={items} onDelete={handleDelete} />;
}
```

### 9.2 Data Fetching Optimization

```tsx
// Prefetch data on hover
import { useQueryClient } from '@tanstack/react-query';

function ProductLink({ productId }: { productId: string }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(productId),
      queryFn: () => productApi.getById(productId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link href={`/products/${productId}`} onMouseEnter={handleMouseEnter}>
      View Product
    </Link>
  );
}

// Infinite scroll with virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualProductList({ products }: { products: Product[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 10. Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME="Retail Management"
NEXT_PUBLIC_VERSION=1.0.0

# .env.production
NEXT_PUBLIC_API_URL=https://api.retailmanagement.com
NEXT_PUBLIC_APP_NAME="Retail Management"
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

```tsx
// src/lib/constants/config.ts

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Retail Management',
  version: process.env.NEXT_PUBLIC_VERSION || '0.0.0',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;
```

---

## 11. Checklist

### 11.1 Code Review Checklist

- [ ] Component follows structure guidelines
- [ ] TypeScript types are properly defined
- [ ] No `any` types (use `unknown` if necessary)
- [ ] Proper error handling
- [ ] Loading and empty states handled
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Responsive design checked
- [ ] Performance considerations (memo, useMemo, useCallback)
- [ ] Unit tests added for business logic
- [ ] No console.log statements
- [ ] No hardcoded strings (use constants/i18n)

### 11.2 PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] UI/UX improvement

## Screenshots (if applicable)

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed
- [ ] Tested on mobile
- [ ] Tested offline functionality

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] TypeScript errors resolved
- [ ] No ESLint warnings
- [ ] Accessibility checked
```

---

## 12. Related Documents

- [01_product_requirements.md](../spec/01_product_requirements.md) - Product Requirements Document
- [02_future_proof_architecture.md](../spec/02_future_proof_architecture.md) - Future-Proof Architecture Guide
- [java_conventions.md](./java_conventions.md) - Java Backend Conventions
