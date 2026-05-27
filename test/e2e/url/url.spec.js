import { test, expect } from '@playwright/test';

test.describe('E2E: url rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/url/fixture.html');
  });

  test('fails for invalid url', async ({ page }) => {
    await page.fill('#field', 'invalidurl');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for url without domain', async ({ page }) => {
    await page.fill('#field', 'http://');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for url without TLD', async ({ page }) => {
    await page.fill('#field', 'http://example');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for valid url with HTTPS', async ({ page }) => {
    await page.fill('#field', 'https://example.com');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for url with subdomain', async ({ page }) => {
    await page.fill('#field', 'https://sub.example.com');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'notanurl');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid URL.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'https://example.com');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
