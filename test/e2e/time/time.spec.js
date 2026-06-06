import { test, expect } from '@playwright/test';

test.describe('E2E: time rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/time/fixture.html');
  });

  test('fails for invalid hour', async ({ page }) => {
    await page.fill('#field', '24:00');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for invalid minute', async ({ page }) => {
    await page.fill('#field', '12:60');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for missing minute digits', async ({ page }) => {
    await page.fill('#field', '9:5');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for HH:MM format', async ({ page }) => {
    await page.fill('#field', '09:30');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for H:MM format', async ({ page }) => {
    await page.fill('#field', '9:30');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for HH:MM:SS format', async ({ page }) => {
    await page.fill('#field', '23:59:59');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', '99:99');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid time (HH:MM or HH:MM:SS).');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', '0:00');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });

  test('clears error on valid input after failed submit', async ({ page }) => {
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);

    await page.fill('#field', '13:45');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });
});
