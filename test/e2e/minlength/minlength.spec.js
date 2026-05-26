import { test, expect } from '@playwright/test';

test.describe('E2E: minlength rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/minlength/fixture.html');
  });

  test('fails when value is shorter than minimum', async ({ page }) => {
    await page.fill('#field', 'abcd');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/jsv-invalid/);
  });

  test('passes when value meets exact minimum length', async ({ page }) => {
    await page.fill('#field', 'abcde');
    await expect(page.locator('#field')).not.toHaveClass(/jsv-invalid/);
  });

  test('passes when value exceeds minimum length', async ({ page }) => {
    await page.fill('#field', 'abcdefgh');
    await expect(page.locator('#field')).not.toHaveClass(/jsv-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'ab');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter at least 5 characters.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'abcde');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
