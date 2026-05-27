import { test, expect } from '@playwright/test';

test.describe('E2E: alphanumeric rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alphanumeric/fixture.html');
  });

  test('fails for value with spaces', async ({ page }) => {
    await page.fill('#field', 'hello world');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for value with special characters', async ({ page }) => {
    await page.fill('#field', 'hello@world');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for value with hyphens', async ({ page }) => {
    await page.fill('#field', 'hello-world');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for letters only', async ({ page }) => {
    await page.fill('#field', 'helloworld');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for digits only', async ({ page }) => {
    await page.fill('#field', '12345');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for letters and digits', async ({ page }) => {
    await page.fill('#field', 'hello123');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for value with underscores', async ({ page }) => {
    await page.fill('#field', 'hello_world');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'bad value!');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter only letters, numbers, and underscores.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'valid_input123');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
