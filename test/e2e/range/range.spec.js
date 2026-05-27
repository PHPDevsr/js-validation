import { test, expect } from '@playwright/test';

test.describe('E2E: range rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/range/fixture.html');
  });

  test('fails when value is below minimum', async ({ page }) => {
    await page.fill('#field', '1');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails when value exceeds maximum', async ({ page }) => {
    await page.fill('#field', '9');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes when value meets exact minimum', async ({ page }) => {
    await page.fill('#field', '2');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes when value meets exact maximum', async ({ page }) => {
    await page.fill('#field', '8');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes when value is within range', async ({ page }) => {
    await page.fill('#field', '5');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', '1');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a value between 2 and 8.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', '5');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
