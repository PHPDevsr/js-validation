import { test, expect } from '@playwright/test';

test.describe('E2E: numeric rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/numeric/fixture.html');
  });

  test('fails for alphabetic characters', async ({ page }) => {
    await page.fill('#field', 'abc');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for mixed alphanumeric', async ({ page }) => {
    await page.fill('#field', '123abc');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for decimal numbers', async ({ page }) => {
    await page.fill('#field', '12.34');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for negative numbers', async ({ page }) => {
    await page.fill('#field', '-5');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for integer digits only', async ({ page }) => {
    await page.fill('#field', '12345');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for single digit', async ({ page }) => {
    await page.fill('#field', '0');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'abc');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter only numeric values.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', '42');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });

  test('clears error on valid input after failed submit', async ({ page }) => {
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);

    await page.fill('#field', '999');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });
});
