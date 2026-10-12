// Playwright test: import from @playwright/test, not 'vitest'. Must NOT be extracted as Vitest.
import { test, expect } from '@playwright/test'

test('playwright test', async ({ page }) => {
  await page.goto('https://example.com')
  expect(page).toBeDefined()
})
