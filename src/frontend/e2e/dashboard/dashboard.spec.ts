import { test, expect, TEST_USER } from '../fixtures/auth.fixture'

test.describe('Dashboard - Authenticated', () => {
  test('should display dashboard after authentication', async ({ authenticatedPage: page }) => {
    // Already authenticated via fixture
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByText(`Welcome, ${TEST_USER.firstName}`)).toBeVisible()
  })

  test('should display dashboard metrics', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('heading', { name: 'Total Products' })).toBeVisible()
    await expect(page.getByRole('heading', { name: "Today's Sales" })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Low Stock Items' })).toBeVisible()
  })

  test('should display quick actions', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('heading', { name: 'Quick Actions' })).toBeVisible()
    await expect(page.getByRole('link', { name: /New Sale/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Add Product/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Add Customer/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /View Reports/ })).toBeVisible()
  })

  test('should display navigation sidebar', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sales' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible()
  })

  test('should navigate to products page', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Products' }).click()
    await expect(page).toHaveURL('/products')
  })

  test('should navigate to sales page', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Sales' }).click()
    await expect(page).toHaveURL('/sales')
  })

  test('should navigate to customers page', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Customers' }).click()
    await expect(page).toHaveURL('/customers')
  })

  test('should navigate to settings page', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page).toHaveURL('/settings')
  })
})
