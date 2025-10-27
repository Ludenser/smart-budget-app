import { test, expect } from '@playwright/test';

test('share report placeholder', async ({ page }) => {
  await page.goto('/app/profile');
  await expect(page.locator('text=Публичные отчёты')).toBeVisible();
});
