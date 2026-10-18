import { test, expect } from '@playwright/test';

test.describe('E2E: max rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/max/fixture.html');
  });

  test('fails for invalid value', async ({ page }) => {
    await page.fill('#field', "9");
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', "Please enter a value less than or equal to 5.");
    await expect(page.locator('#status')).toHaveText('');
  });

  test('passes for valid value', async ({ page }) => {
    await page.fill('#field', "5");
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', "5");
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
