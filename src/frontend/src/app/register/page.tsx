'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSignUp } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Package, Loader2, AlertCircle } from 'lucide-react'
import { getErrorMessage } from '@/lib/api/client'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    tenantCode: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)

  const signUp = useSignUp()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (
      !formData.tenantCode ||
      !formData.businessName ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      await signUp.mutateAsync({
        tenantCode: formData.tenantCode,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress || undefined,
        businessPhone: formData.businessPhone || undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="w-full max-w-lg space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-10 w-10 text-neutral-900 dark:text-neutral-50" />
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Retail Management
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Register your organization and get started with Retail Management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Organization Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Organization Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tenantCode">Organization Code *</Label>
                    <Input
                      id="tenantCode"
                      name="tenantCode"
                      type="text"
                      placeholder="my-store"
                      value={formData.tenantCode}
                      onChange={handleChange}
                      disabled={signUp.isPending}
                    />
                    <p className="text-xs text-neutral-500">
                      Unique identifier (letters, numbers, hyphens)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="My Store LLC"
                      value={formData.businessName}
                      onChange={handleChange}
                      disabled={signUp.isPending}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone</Label>
                    <Input
                      id="businessPhone"
                      name="businessPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      disabled={signUp.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Input
                      id="businessAddress"
                      name="businessAddress"
                      type="text"
                      placeholder="123 Main St, City"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      disabled={signUp.isPending}
                    />
                  </div>
                </div>
              </div>

              {/* User Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Admin Account
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={signUp.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={signUp.isPending}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      disabled={signUp.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={signUp.isPending}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={signUp.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={signUp.isPending}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={signUp.isPending}>
                {signUp.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                Already have an account?{' '}
              </span>
              <Link
                href="/login"
                className="font-medium text-neutral-900 hover:underline dark:text-neutral-50"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
