'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRoles?: string[]
  fallbackPath?: string
}

export function AuthGuard({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/login',
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, user, hasPermission, hasRole } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store current path for redirect after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname)
      }
      router.push(fallbackPath)
    }
  }, [isAuthenticated, isLoading, router, pathname, fallbackPath])

  // Check loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    )
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return null
  }

  // Check required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((p) => hasPermission(p))
    if (!hasAllPermissions) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-neutral-600">
            You do not have permission to access this page.
          </p>
        </div>
      )
    }
  }

  // Check required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((r) => hasRole(r))
    if (!hasRequiredRole) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-neutral-600">
            You do not have the required role to access this page.
          </p>
        </div>
      )
    }
  }

  return <>{children}</>
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
