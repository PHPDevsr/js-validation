import { test, expect } from '@playwright/test';

test.describe('js-validation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fixture.html');
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.click('#submit-btn');

    const username = page.locator('#username');
    await expect(username).toHaveClass(/jsv-invalid/);

    const email = page.locator('#email');
    await expect(email).toHaveClass(/jsv-invalid/);

    const password = page.locator('#password');
    await expect(password).toHaveClass(/jsv-invalid/);

    // Status should NOT show success
    await expect(page.locator('#status')).toHaveText('');
  });

  test('validates email format', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'invalid-email');
    await page.fill('#password', 'secret123');
    await page.fill('#confirmPassword', 'secret123');
    await page.click('#submit-btn');

    const email = page.locator('#email');
    await expect(email).toHaveClass(/jsv-invalid/);
    await expect(page.locator('#status')).toHaveText('');
  });

  test('validates minlength', async ({ page }) => {
    await page.fill('#username', 'ab');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'secret123');
    await page.fill('#confirmPassword', 'secret123');
    await page.click('#submit-btn');

    const username = page.locator('#username');
    await expect(username).toHaveClass(/jsv-invalid/);
    await expect(page.locator('#status')).toHaveText('');
  });

  test('validates equalTo (password confirmation)', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'secret123');
    await page.fill('#confirmPassword', 'different');
    await page.click('#submit-btn');

    const confirm = page.locator('#confirmPassword');
    await expect(confirm).toHaveClass(/jsv-invalid/);
    await expect(page.locator('#status')).toHaveText('');
  });

  test('submits successfully when all fields are valid', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'secret123');
    await page.fill('#confirmPassword', 'secret123');
    await page.click('#submit-btn');

    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });

  test('clears errors on valid input after failed submit', async ({ page }) => {
    // First submit with empty fields
    await page.click('#submit-btn');
    await expect(page.locator('#username')).toHaveClass(/jsv-invalid/);

    // Fill valid data - input event should clear error
    await page.fill('#username', 'testuser');
    await expect(page.locator('#username')).not.toHaveClass(/jsv-invalid/);
  });

  test('real-time validation on input event', async ({ page }) => {
    // Type invalid email
    await page.fill('#email', 'bad');
    // Trigger blur won't help, but the input event handler validates per-field
    // After typing, the field should be checked
    await page.fill('#username', 'usr');
    await page.fill('#email', 'notvalid');
    await page.click('#submit-btn');

    await expect(page.locator('#email')).toHaveClass(/jsv-invalid/);

    // Fix the email
    await page.fill('#email', 'user@example.com');
    await expect(page.locator('#email')).not.toHaveClass(/jsv-invalid/);
  });
});
