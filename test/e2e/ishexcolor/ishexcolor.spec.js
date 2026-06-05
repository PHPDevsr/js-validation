import { test, expect } from '@playwright/test';

test.describe('E2E: ishexcolor rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ishexcolor/fixture.html');
  });

  test('fails for value without hash prefix', async ({ page }) => {
    await page.fill('#field', 'ffffff');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for too-short hex value', async ({ page }) => {
    await page.fill('#field', '#ff');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for too-long hex value', async ({ page }) => {
    await page.fill('#field', '#fffffff');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for invalid characters', async ({ page }) => {
    await page.fill('#field', '#zzzzzz');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for valid 6-digit hex color', async ({ page }) => {
    await page.fill('#field', '#1a2b3c');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for valid 3-digit hex color', async ({ page }) => {
    await page.fill('#field', '#abc');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for uppercase hex color', async ({ page }) => {
    await page.fill('#field', '#AABBCC');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'notacolor');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid hex color (e.g. #fff or #ffffff).');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', '#ff5733');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
