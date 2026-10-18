import { test, expect } from '@playwright/test';

test.describe('E2E: require_from_group rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/require_from_group/fixture.html');
  });

  test('fails when no group field is filled', async ({ page }) => {
    await page.click('#submit-btn');
    await expect(page.locator('#phone')).toHaveClass(/is-invalid/);
    await expect(page.locator('#email')).toHaveClass(/is-invalid/);
    await expect(page.locator('#phone')).toHaveAttribute('data-jsv-message', 'Please fill at least 1 of these fields.');
  });

  test('passes when one group field is filled', async ({ page }) => {
    await page.fill('#email', 'a@b.co');
    await page.click('#submit-btn');
    await expect(page.locator('#phone')).not.toHaveClass(/is-invalid/);
    await expect(page.locator('#email')).not.toHaveClass(/is-invalid/);
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
