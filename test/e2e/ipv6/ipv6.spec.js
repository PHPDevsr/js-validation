import { test, expect } from '@playwright/test';

test.describe('E2E: ipv6 rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ipv6/fixture.html');
  });

  test('fails for invalid hex characters', async ({ page }) => {
    await page.fill('#field', 'gggg::1');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for plain IPv4 address', async ({ page }) => {
    await page.fill('#field', '192.168.1.1');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('fails for too many groups', async ({ page }) => {
    await page.fill('#field', '2001:db8:85a3:0:0:8a2e:370:7334:extra');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for full IPv6 address', async ({ page }) => {
    await page.fill('#field', '2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for compressed IPv6 address', async ({ page }) => {
    await page.fill('#field', '2001:db8::1');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('passes for loopback ::1', async ({ page }) => {
    await page.fill('#field', '::1');
    await expect(page.locator('#field')).not.toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.fill('#field', 'not-an-ipv6');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveAttribute('data-jsv-message', 'Please enter a valid IPv6 address.');
  });

  test('submits successfully when valid', async ({ page }) => {
    await page.fill('#field', 'fe80::1');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
