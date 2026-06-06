import { test, expect } from '@playwright/test';

test.describe('E2E: alpha rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alpha/fixture.html');
  });

  test('fails for value with digits', async ({ page }) => {
    await page.fill('#field', 'hello123');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
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

  test('fails for value with underscores', async ({ page }) => {
    await page.fill('#field', 'hello_world');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for lowercase letters only', async ({ page }) => {
    await page.fill('#field', 'hello');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for uppercase letters only', async ({ page }) => {
    await page.fill('#field', 'HELLO');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for mixed case letters', async ({ page }) => {
    await page.fill('#field', 'HelloWorld');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'bad123!');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter only alphabetic letters.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'HelloWorld');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
