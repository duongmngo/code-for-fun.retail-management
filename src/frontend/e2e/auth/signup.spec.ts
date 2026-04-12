import { test, expect } from '@playwright/test'

test.describe('Sign Up', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('should display the registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Organization Code *' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Business Name *' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'First Name *' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Last Name *' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Email *' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Password *', exact: true })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Confirm Password *' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
  })

  test('should have link to sign in page', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: 'Sign in' })
    await expect(signInLink).toBeVisible()
    await signInLink.click()
    await expect(page).toHaveURL('/login')
  })

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Form should not submit - still on register page
    await expect(page).toHaveURL('/register')
  })

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Organization Code *' }).fill('test-org')
    await page.getByRole('textbox', { name: 'Business Name *' }).fill('Test Business')
    await page.getByRole('textbox', { name: 'First Name *' }).fill('John')
    await page.getByRole('textbox', { name: 'Last Name *' }).fill('Doe')
    await page.getByRole('textbox', { name: 'Email *' }).fill('test@example.com')
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill('Password@123')
    await page.getByRole('textbox', { name: 'Confirm Password *' }).fill('DifferentPassword@123')
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should show password mismatch error
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should show error for invalid password format', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Organization Code *' }).fill('test-org')
    await page.getByRole('textbox', { name: 'Business Name *' }).fill('Test Business')
    await page.getByRole('textbox', { name: 'First Name *' }).fill('John')
    await page.getByRole('textbox', { name: 'Last Name *' }).fill('Doe')
    await page.getByRole('textbox', { name: 'Email *' }).fill('test@example.com')
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill('weak')
    await page.getByRole('textbox', { name: 'Confirm Password *' }).fill('weak')
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should show password validation error
    await expect(page.getByText(/password must/i)).toBeVisible()
  })

  test('should show error for invalid organization code format', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Organization Code *' }).fill('Invalid Code!')
    await page.getByRole('textbox', { name: 'Business Name *' }).fill('Test Business')
    await page.getByRole('textbox', { name: 'First Name *' }).fill('John')
    await page.getByRole('textbox', { name: 'Last Name *' }).fill('Doe')
    await page.getByRole('textbox', { name: 'Email *' }).fill('test@example.com')
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill('Password@123')
    await page.getByRole('textbox', { name: 'Confirm Password *' }).fill('Password@123')
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should show organization code validation error
    await expect(page.getByText(/lowercase|letters|numbers|hyphens/i)).toBeVisible()
  })

  test('should successfully register a new organization', async ({ page }) => {
    // Generate unique tenant code with timestamp
    const uniqueCode = `e2e-test-${Date.now()}`
    
    await page.getByRole('textbox', { name: 'Organization Code *' }).fill(uniqueCode)
    await page.getByRole('textbox', { name: 'Business Name *' }).fill('E2E Test Business')
    await page.getByRole('textbox', { name: 'Business Phone' }).fill('+1 555 123-4567')
    await page.getByRole('textbox', { name: 'Business Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'First Name *' }).fill('Test')
    await page.getByRole('textbox', { name: 'Last Name *' }).fill('User')
    await page.getByRole('textbox', { name: 'Email *' }).fill(`test-${Date.now()}@example.com`)
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('+1 555 987-6543')
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill('TestPass@123')
    await page.getByRole('textbox', { name: 'Confirm Password *' }).fill('TestPass@123')
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('should show error for duplicate organization code', async ({ page }) => {
    // Use an existing tenant code (from previous tests)
    await page.getByRole('textbox', { name: 'Organization Code *' }).fill('hello')
    await page.getByRole('textbox', { name: 'Business Name *' }).fill('Duplicate Business')
    await page.getByRole('textbox', { name: 'First Name *' }).fill('John')
    await page.getByRole('textbox', { name: 'Last Name *' }).fill('Doe')
    await page.getByRole('textbox', { name: 'Email *' }).fill('duplicate@example.com')
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill('Password@123')
    await page.getByRole('textbox', { name: 'Confirm Password *' }).fill('Password@123')
    
    await page.getByRole('button', { name: 'Create account' }).click()
    
    // Should show duplicate tenant error - use first() since error may appear in multiple places
    await expect(page.getByText(/already exists/i).first()).toBeVisible({ timeout: 5000 })
  })

  test('should navigate from home page to register', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Get Started' }).click()
    await expect(page).toHaveURL('/register')
  })
})
