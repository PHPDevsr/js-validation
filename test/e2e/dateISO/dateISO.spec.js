import { test, expect } from '@playwright/test';

test.describe('E2E: dateISO rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dateISO/fixture.html');
  });

  test('fails for non-ISO format', async ({ page }) => {
    await page.fill('#field', '05/27/2026');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for YYYY-MM-DD format', async ({ page }) => {
    await page.fill('#field', '2026-05-27');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for YYYY/MM/DD format', async ({ page }) => {
    await page.fill('#field', '2026/05/27');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', '2026.05.27');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid ISO date (YYYY-MM-DD).');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', '2026-05-27');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
