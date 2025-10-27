import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'apps/web/tests/e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});
