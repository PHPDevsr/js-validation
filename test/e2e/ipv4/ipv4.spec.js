import { test, expect } from '@playwright/test';

test.describe('E2E: ipv4 rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ipv4/fixture.html');
  });

  test('fails for out-of-range octet', async ({ page }) => {
    await page.fill('#field', '999.999.999.999');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for partial address', async ({ page }) => {
    await page.fill('#field', '192.168.1');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for address with letters', async ({ page }) => {
    await page.fill('#field', '192.168.1.abc');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for valid IPv4 address', async ({ page }) => {
    await page.fill('#field', '192.168.1.1');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for loopback address', async ({ page }) => {
    await page.fill('#field', '127.0.0.1');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for broadcast address', async ({ page }) => {
    await page.fill('#field', '255.255.255.255');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', '300.1.1.1');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid IPv4 address.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', '10.0.0.1');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
