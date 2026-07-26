import { defineConfig, devices } from '@playwright/test';

/**
 * Config ini meniru struktur environment berjenjang (local/dev/staging/prod)
 * dengan membagi test ke 3 "project" sesuai layer produk: api, backoffice, app.
 *
 * Cara pakai:
 *   npx playwright test                    -> jalankan semua
 *   npx playwright test --project=api       -> jalankan API core saja
 *   npx playwright test --project=backoffice
 *   npx playwright test --project=app
 *   npx playwright test --grep @smoke       -> jalankan yang di-tag smoke saja
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // retry max 1x, hanya di CI (lihat kebijakan maintenance)
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: './api-tests',
      use: {
        baseURL: 'https://dummyjson.com',
      },
    },
    {
      name: 'backoffice',
      testDir: './backoffice-tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://the-internet.herokuapp.com',
      },
    },
    {
      name: 'app',
      testDir: './app-tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
      },
    },
  ],
});
