import { test as base, expect } from '@playwright/test'

// Test user credentials for e2e tests
export const TEST_USER = {
  tenantCode: 'demo-store',
  email: 'john.doe@demo.com',
  password: 'Demo@123456',
  firstName: 'John',
  lastName: 'Doe',
}

// Extend base test with authentication fixtures
export const test = base.extend<{
  authenticatedPage: typeof base.prototype.page
}>({
  authenticatedPage: async ({ page }, use) => {
    // Sign in before the test
    await page.goto('/login')
    await page.getByRole('textbox', { name: 'Organization Code' }).fill(TEST_USER.tenantCode)
    await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USER.email)
    await page.getByRole('textbox', { name: 'Password' }).fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    
    // Use the authenticated page
    await use(page)
  },
})

export { expect }

// Helper to generate unique test data
export function generateUniqueTestData() {
  const timestamp = Date.now()
  return {
    tenantCode: `e2e-${timestamp}`,
    email: `e2e-${timestamp}@test.com`,
    businessName: `E2E Test Business ${timestamp}`,
    firstName: 'E2E',
    lastName: 'User',
    password: 'TestPass@123',
  }
}

// Helper to sign up a new user
export async function signUpUser(
  page: typeof base.prototype.page,
  userData: ReturnType<typeof generateUniqueTestData>
) {
  await page.goto('/register')
  await page.getByRole('textbox', { name: 'Organization Code *' }).fill(userData.tenantCode)
  await page.getByRole('textbox', { name: 'Business Name *' }).fill(userData.businessName)
  await page.getByRole('textbox', { name: 'First Name *' }).fill(userData.firstName)
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(userData.lastName)
  await page.getByRole('textbox', { name: 'Email *' }).fill(userData.email)
  await page.getByRole('textbox', { name: 'Password *', exact: true }).fill(userData.password)
  await page.getByRole('textbox', { name: 'Confirm Password *' }).fill(userData.password)
  await page.getByRole('button', { name: 'Create account' }).click()
  
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
}

// Helper to sign in a user
export async function signInUser(
  page: typeof base.prototype.page,
  credentials: { tenantCode: string; email: string; password: string }
) {
  await page.goto('/login')
  await page.getByRole('textbox', { name: 'Organization Code' }).fill(credentials.tenantCode)
  await page.getByRole('textbox', { name: 'Email' }).fill(credentials.email)
  await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
}

// Helper to logout
export async function logout(page: typeof base.prototype.page) {
  await page.getByRole('button', { name: 'Logout' }).click()
  await expect(page).toHaveURL('/login')
}
