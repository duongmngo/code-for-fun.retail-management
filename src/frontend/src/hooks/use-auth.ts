'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi, SignInRequest, SignUpRequest, AuthResponse } from '@/lib/api/auth'
import { useAuthStore } from '@/stores/auth-store'
import { getErrorMessage } from '@/lib/api/client'

export function useSignIn() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (request: SignInRequest) => authApi.signIn(request),
    onSuccess: (data: AuthResponse) => {
      // Store tokens
      setTokens(data.accessToken, data.refreshToken)

      // Store user info
      setUser({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        tenantId: data.user.tenantId,
        roles: data.user.roles,
        permissions: data.user.permissions,
      })

      // Clear any cached queries
      queryClient.clear()

      // Redirect to dashboard
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error('Sign in failed:', getErrorMessage(error))
    },
  })
}

export function useSignUp() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (request: SignUpRequest) => authApi.signUp(request),
    onSuccess: (data: AuthResponse) => {
      // Store tokens
      setTokens(data.accessToken, data.refreshToken)

      // Store user info
      setUser({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        tenantId: data.user.tenantId,
        roles: data.user.roles,
        permissions: data.user.permissions,
      })

      // Clear any cached queries
      queryClient.clear()

      // Redirect to dashboard
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error('Sign up failed:', getErrorMessage(error))
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout, refreshToken } = useAuthStore.getState()

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    },
    onSuccess: () => {
      // Clear auth state
      logout()

      // Clear all cached queries
      queryClient.clear()

      // Redirect to login
      router.push('/login')
    },
    onError: () => {
      // Even on error, clear local auth state
      logout()
      queryClient.clear()
      router.push('/login')
    },
  })
}

export function useLogoutAll() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore.getState()

  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      router.push('/login')
    },
    onError: () => {
      logout()
      queryClient.clear()
      router.push('/login')
    },
  })
}

// Hook to check if user has permission
export function usePermission(permission: string): boolean {
  const { hasPermission } = useAuthStore()
  return hasPermission(permission)
}

// Hook to check if user has role
export function useRole(role: string): boolean {
  const { hasRole } = useAuthStore()
  return hasRole(role)
}

// Hook to get current user
export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  return { user, isAuthenticated, isLoading }
}
