import { test, expect } from '@playwright/test';

test.describe('E2E: different rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/different/fixture.html');
  });

  test('fails when values match', async ({ page }) => {
    await page.fill('#password', 'secret');
    await page.click('#submit-btn');
    await expect(page.locator('#password')).toHaveClass(/is-invalid/);
    await expect(page.locator('#password')).toHaveAttribute('data-jsv-message', 'Please enter a different value.');
    await expect(page.locator('#status')).toHaveText('');
  });

  test('passes when values differ', async ({ page }) => {
    await page.fill('#password', 'another');
    await page.click('#submit-btn');
    await expect(page.locator('#password')).not.toHaveClass(/is-invalid/);
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
