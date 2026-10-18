import { test, expect } from '@playwright/test';

test.describe('E2E: url2 rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/url2/fixture.html');
  });

  test('fails for invalid value', async ({ page }) => {
    await page.fill('#field', "example.com");
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', "Please enter a valid URL including http:// or https://.");
    await expect(page.locator('#status')).toHaveText('');
  });

  test('passes for valid value', async ({ page }) => {
    await page.fill('#field', "https://example.com/path");
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', "https://example.com/path");
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
