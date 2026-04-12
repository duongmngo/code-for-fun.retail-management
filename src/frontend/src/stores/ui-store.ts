import { create } from 'zustand'

export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  isOnline: boolean
  isSyncing: boolean
}

export interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: UIState['theme']) => void
  setOnline: (isOnline: boolean) => void
  setSyncing: (isSyncing: boolean) => void
}

export const useUIStore = create<UIState & UIActions>()((set) => ({
  sidebarOpen: true,
  theme: 'system',
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  setOnline: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
}))

// Set up online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useUIStore.getState().setOnline(true))
  window.addEventListener('offline', () => useUIStore.getState().setOnline(false))
}
