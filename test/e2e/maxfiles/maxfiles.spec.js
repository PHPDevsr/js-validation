import { test, expect } from '@playwright/test';

function makeFile(name, size) {
  return {
    name,
    mimeType: 'text/plain',
    buffer: Buffer.alloc(size, 'a')
  };
}

test.describe('E2E: maxfiles rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/maxfiles/fixture.html');
  });

  test('fails when selected file count exceeds the limit', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('one.txt', 128),
      makeFile('two.txt', 128),
      makeFile('three.txt', 128)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#attachments')).toHaveClass(/is-invalid/);
  });

  test('displays custom error message', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('one.txt', 128),
      makeFile('two.txt', 128),
      makeFile('three.txt', 128)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#attachments')).toHaveAttribute('data-jsv-message', 'Please select at most 2 files.');
  });

  test('passes when selected file count is within the limit', async ({ page }) => {
    await page.setInputFiles('#attachments', [
      makeFile('one.txt', 128),
      makeFile('two.txt', 128)
    ]);
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
