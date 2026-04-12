import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Package, ShoppingCart, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-neutral-900 dark:text-neutral-50" />
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Retail Management
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50">
            Manage Your Retail Business
            <br />
            <span className="text-neutral-500 dark:text-neutral-400">With Confidence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            A comprehensive multi-tenant solution for inventory management, point of sale, and
            business analytics. Works offline, syncs when connected.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Everything You Need
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-600 dark:text-neutral-400">
            Powerful features designed for small to medium retail businesses
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Package className="h-10 w-10 text-neutral-700 dark:text-neutral-300" />
                <CardTitle className="mt-4">Inventory Management</CardTitle>
                <CardDescription>
                  Track stock levels, set reorder points, and manage multiple locations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-10 w-10 text-neutral-700 dark:text-neutral-300" />
                <CardTitle className="mt-4">Point of Sale</CardTitle>
                <CardDescription>
                  Fast checkout, multiple payment methods, and offline support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-neutral-700 dark:text-neutral-300" />
                <CardTitle className="mt-4">Customer Management</CardTitle>
                <CardDescription>
                  Loyalty programs, purchase history, and customer insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-neutral-700 dark:text-neutral-300" />
                <CardTitle className="mt-4">Analytics & Reports</CardTitle>
                <CardDescription>
                  Real-time dashboards, sales reports, and inventory analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Retail Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
