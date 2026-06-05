import { test, expect } from '@playwright/test';

function makeFile(name, size) {
  return {
    name,
    mimeType: 'text/plain',
    buffer: Buffer.alloc(size, 'a')
  };
}

test.describe('E2E: maxsize rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/maxsize/fixture.html');
  });

  test('fails when any selected file exceeds the limit', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('small.txt', 512),
      makeFile('large.txt', 4096)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#attachments')).toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('small.txt', 512),
      makeFile('large.txt', 4096)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#attachments')).toHaveAttribute('data-jsv-message', 'Each file must be 2KB or smaller.');
  });

  test('passes when all selected files are within the limit', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('small.txt', 512),
      makeFile('medium.txt', 1024)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
