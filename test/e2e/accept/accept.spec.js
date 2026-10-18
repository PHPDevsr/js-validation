import { test, expect } from '@playwright/test';

test.describe('E2E: accept rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accept/fixture.html');
  });

  test('fails for a MIME type outside the wildcard', async ({ page }) => {
    await page.setInputFiles('#upload', { name: 'doc.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
    await page.click('#submit-btn');
    await expect(page.locator('#upload')).toHaveClass(/is-invalid/);
    await expect(page.locator('#upload')).toHaveAttribute('data-jsv-message', 'Please select a file with an accepted type: image/*.');
  });

  test('passes for a MIME type inside the wildcard', async ({ page }) => {
    await page.setInputFiles('#upload', { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('x') });
    await page.click('#submit-btn');
    await expect(page.locator('#upload')).not.toHaveClass(/is-invalid/);
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
