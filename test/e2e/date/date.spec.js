import { test, expect } from '@playwright/test';

test.describe('E2E: date rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/date/fixture.html');
  });

  test('fails for invalid date text', async ({ page }) => {
    await page.fill('#field', 'not-a-date');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for valid date text', async ({ page }) => {
    await page.fill('#field', '2026-05-27');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'bad-date');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid date.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', '2026-05-27');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
