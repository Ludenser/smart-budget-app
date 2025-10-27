import { test, expect } from '@playwright/test';

test('dashboard basic flow', async ({ page }) => {
  await page.goto('/app/dashboard');
  await expect(page.locator('text=Расходы по категориям')).toBeVisible();
});
