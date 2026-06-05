import { test, expect } from '@playwright/test';

function makeFile(name, size) {
  return {
    name,
    mimeType: 'text/plain',
    buffer: Buffer.alloc(size, 'a')
  };
}

test.describe('E2E: maxsizetotal rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/maxsizetotal/fixture.html');
  });

  test('fails when combined size of all files exceeds the limit', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('a.txt', 1024),
      makeFile('b.txt', 1024),
      makeFile('c.txt', 1025)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#attachments')).toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('a.txt', 1024),
      makeFile('b.txt', 1024),
      makeFile('c.txt', 1025)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#attachments')).toHaveAttribute('data-jsv-message', 'Total size of all files must not exceed 3KB.');
  });

  test('passes when combined size of all files is within the limit', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('a.txt', 1024),
      makeFile('b.txt', 1024),
      makeFile('c.txt', 1024)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
