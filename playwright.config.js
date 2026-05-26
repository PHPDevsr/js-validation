import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
  },
  webServer: {
    command: 'npx vite --port 5174 --config vite.config.e2e.js',
    port: 5174,
    reuseExistingServer: !process.env.CI,
  },
});
