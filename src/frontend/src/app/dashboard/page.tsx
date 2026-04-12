'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { useCurrentUser, useLogout } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Settings,
  Menu,
} from 'lucide-react'
import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'

function DashboardContent() {
  const { user } = useCurrentUser()
  const logout = useLogout()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const stats = [
    { name: 'Total Products', value: '0', icon: Package, href: '/products' },
    { name: 'Today\'s Sales', value: '$0.00', icon: ShoppingCart, href: '/sales' },
    { name: 'Customers', value: '0', icon: Users, href: '/customers' },
    { name: 'Low Stock Items', value: '0', icon: BarChart3, href: '/inventory/low-stock' },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-neutral-900 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-6">
          <Package className="h-8 w-8 text-white" />
          <span className="text-lg font-bold text-white">Retail Mgmt</span>
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-neutral-800 px-4 py-2 text-white"
              >
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="flex items-center gap-3 rounded-lg px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <Package className="h-5 w-5" />
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/sales"
                className="flex items-center gap-3 rounded-lg px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <ShoppingCart className="h-5 w-5" />
                Sales
              </Link>
            </li>
            <li>
              <Link
                href="/customers"
                className="flex items-center gap-3 rounded-lg px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <Users className="h-5 w-5" />
                Customers
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-4 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-950">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Welcome, {user?.firstName}
            </span>
            <Button variant="ghost" size="sm" onClick={() => logout.mutate()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 bg-neutral-50 p-6 dark:bg-neutral-900">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Welcome back! Here&apos;s an overview of your store.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {stat.name}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-neutral-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <Link
                    href={stat.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50"
                  >
                    View details →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/sales/new">
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <ShoppingCart className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                    <CardTitle className="mt-2">New Sale</CardTitle>
                    <CardDescription>Start a new point of sale transaction</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/products/new">
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <Package className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                    <CardTitle className="mt-2">Add Product</CardTitle>
                    <CardDescription>Add a new product to inventory</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/customers/new">
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <Users className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                    <CardTitle className="mt-2">Add Customer</CardTitle>
                    <CardDescription>Register a new customer</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/reports">
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <BarChart3 className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
                    <CardTitle className="mt-2">View Reports</CardTitle>
                    <CardDescription>Analyze sales and inventory data</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
