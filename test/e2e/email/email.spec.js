import { test, expect } from '@playwright/test';

test.describe('E2E: email rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/email/fixture.html');
  });

  test('fails for invalid email without @', async ({ page }) => {
    await page.fill('#field', 'invalidemail');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for email without domain', async ({ page }) => {
    await page.fill('#field', 'user@');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for email without TLD', async ({ page }) => {
    await page.fill('#field', 'user@domain');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for valid email', async ({ page }) => {
    await page.fill('#field', 'user@example.com');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for email with subdomain', async ({ page }) => {
    await page.fill('#field', 'user@sub.example.com');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'notanemail');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid email address.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'user@example.com');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
