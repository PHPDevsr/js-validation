import { test, expect } from '@playwright/test';

test.describe('E2E: maxlength rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/maxlength-fixture.html');
  });

  test('fails when value exceeds maximum length', async ({ page }) => {
    await page.fill('#field', 'abcdefghijk');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/jsv-invalid/);
  });

  test('passes when value meets exact maximum length', async ({ page }) => {
    await page.fill('#field', 'abcdefghij');
    await expect(page.locator('#field')).not.toHaveClass(/jsv-invalid/);
  });

  test('passes when value is shorter than maximum', async ({ page }) => {
    await page.fill('#field', 'abc');
    await expect(page.locator('#field')).not.toHaveClass(/jsv-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'this is way too long');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter no more than 10 characters.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'short');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
