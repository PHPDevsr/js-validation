import { test, expect } from '@playwright/test';

test.describe('E2E: extension rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/extension/fixture.html');
  });

  test('fails for a disallowed extension', async ({ page }) => {
    await page.setInputFiles('#upload', { name: 'virus.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('x') });
    await page.click('#submit-btn');
    await expect(page.locator('#upload')).toHaveClass(/is-invalid/);
    await expect(page.locator('#upload')).toHaveAttribute('data-jsv-message', 'Please select a file with one of these extensions: jpg, png.');
  });

  test('passes for an allowed extension', async ({ page }) => {
    await page.setInputFiles('#upload', { name: 'photo.PNG', mimeType: 'image/png', buffer: Buffer.from('x') });
    await page.click('#submit-btn');
    await expect(page.locator('#upload')).not.toHaveClass(/is-invalid/);
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
