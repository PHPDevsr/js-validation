import { test, expect } from '@playwright/test';

test.describe('E2E: equalTo rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/equalTo-fixture.html');
  });

  test('fails when fields do not match', async ({ page }) => {
    await page.fill('#source', 'hello');
    await page.fill('#confirm', 'world');
    await page.click('#submit-btn');
    await expect(page.locator('#confirm')).toHaveClass(/jsv-invalid/);
  });

  test('fails when target is empty and source has value', async ({ page }) => {
    await page.fill('#source', 'hello');
    await page.fill('#confirm', '');
    await page.click('#submit-btn');
    await expect(page.locator('#confirm')).toHaveClass(/jsv-invalid/);
  });

  test('passes when both fields have the same value', async ({ page }) => {
    await page.fill('#source', 'matching');
    await page.fill('#confirm', 'matching');
    await expect(page.locator('#confirm')).not.toHaveClass(/jsv-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#source', 'hello');
    await page.fill('#confirm', 'different');
    await page.click('#submit-btn');
    await expect(page.locator('#confirm')).toHaveAttribute('data-jsv-message', 'Fields do not match.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#source', 'secret');
    await page.fill('#confirm', 'secret');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
