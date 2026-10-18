import { test, expect } from '@playwright/test';

test.describe('E2E: rangelength rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rangelength/fixture.html');
  });

  test('fails for invalid value', async ({ page }) => {
    await page.fill('#field', "ab");
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', "Please enter a value between 3 and 7 characters long.");
    await expect(page.locator('#status')).toHaveText('');
  });

  test('passes for valid value', async ({ page }) => {
    await page.fill('#field', "abcde");
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', "abcde");
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
