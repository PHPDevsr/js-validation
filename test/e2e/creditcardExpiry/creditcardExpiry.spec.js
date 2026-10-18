import { test, expect } from '@playwright/test';

test.describe('E2E: creditcardExpiry rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/creditcardExpiry/fixture.html');
  });

  test('fails for invalid value', async ({ page }) => {
    await page.fill('#field', "12/20");
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', "Please enter a valid expiry date (MM/YY).");
    await expect(page.locator('#status')).toHaveText('');
  });

  test('passes for valid value', async ({ page }) => {
    await page.fill('#field', "12/40");
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', "12/40");
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
