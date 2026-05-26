import { test, expect } from '@playwright/test';

test.describe('E2E: pattern rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pattern/fixture.html');
  });

  test('fails when value does not match pattern', async ({ page }) => {
    await page.fill('#field', 'invalid');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for partial match (missing digits)', async ({ page }) => {
    await page.fill('#field', 'ABC-');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for wrong case', async ({ page }) => {
    await page.fill('#field', 'abc-1234');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes when value matches pattern exactly', async ({ page }) => {
    await page.fill('#field', 'ABC-1234');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for another valid pattern match', async ({ page }) => {
    await page.fill('#field', 'XYZ-9999');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'wrong');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Must match format ABC-1234.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'ABC-1234');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
