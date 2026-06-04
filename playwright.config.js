import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  testDir: './test/e2e',
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npx vite --port 5174 --config vite.config.e2e.js',
    port: 5174,
    reuseExistingServer: !process.env.CI,
  },
});
