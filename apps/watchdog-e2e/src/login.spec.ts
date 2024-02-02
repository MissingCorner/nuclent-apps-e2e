import { expect, test } from '@playwright/test'

test.describe('Login', () => {
  test('should redirect to keycloak', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#kc-login', { state: 'visible' })
    await expect(page.locator('#kc-login')).toHaveText('Sign In')
  })
})
