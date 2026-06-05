import { test, expect } from '@playwright/test';

test.describe('E2E: notEqualTo rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notEqualTo/fixture.html');
  });

  test('fails when fields match', async ({ page }) => {
    await page.fill('#currentPassword', 'secret123');
    await page.fill('#newPassword', 'secret123');
    await page.click('#submit-btn');
    await expect(page.locator('#newPassword')).toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#currentPassword', 'secret123');
    await page.fill('#newPassword', 'secret123');
    await page.click('#submit-btn');
    await expect(page.locator('#newPassword')).toHaveAttribute('data-jsv-message', 'New password must be different.');
  });

  test('passes when fields are different', async ({ page }) => {
    await page.fill('#currentPassword', 'secret123');
    await page.fill('#newPassword', 'secret456');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
