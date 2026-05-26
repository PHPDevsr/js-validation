import { test, expect } from '@playwright/test';

test.describe('E2E: required rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/required/fixture.html');
  });

  test('fails when field is empty', async ({ page }) => {
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/jsv-invalid/);
    await expect(page.locator('#status')).toHaveText('');
  });

  test('fails when field contains only whitespace', async ({ page }) => {
    await page.fill('#field', '   ');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/jsv-invalid/);
  });

  test('passes when field has a value', async ({ page }) => {
    await page.fill('#field', 'hello');
    await expect(page.locator('#field')).not.toHaveClass(/jsv-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'This field is required.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'value');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });

  test('clears error on valid input after failed submit', async ({ page }) => {
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/jsv-invalid/);

    await page.fill('#field', 'fixed');
    await expect(page.locator('#field')).not.toHaveClass(/jsv-invalid/);
  });
});
