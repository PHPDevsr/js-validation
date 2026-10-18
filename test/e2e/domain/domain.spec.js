import { test, expect } from '@playwright/test';

test.describe('E2E: domain rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/domain/fixture.html');
  });

  test('fails for invalid value', async ({ page }) => {
    await page.fill('#field', "example");
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', "Please enter a valid domain name.");
    await expect(page.locator('#status')).toHaveText('');
  });

  test('passes for valid value', async ({ page }) => {
    await page.fill('#field', "sub.example.co.id");
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', "sub.example.co.id");
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
