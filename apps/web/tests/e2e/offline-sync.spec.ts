import { test, expect } from '@playwright/test';

test('offline add and sync placeholder', async ({ page }) => {
  await page.goto('/app/transactions');
  await expect(page.locator('text=Транзакции')).toBeVisible();
});
