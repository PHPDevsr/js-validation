import { test, expect } from '@playwright/test';

test.describe('E2E: creditcard rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/creditcard/fixture.html');
  });

  test('fails for invalid value', async ({ page }) => {
    await page.fill('#field', "4111 1111 1111 1112");
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', "Please enter a valid credit card number.");
    await expect(page.locator('#status')).toHaveText('');
  });

  test('passes for valid value', async ({ page }) => {
    await page.fill('#field', "4111 1111 1111 1111");
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', "4111 1111 1111 1111");
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
