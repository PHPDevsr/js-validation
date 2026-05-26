import { test, expect } from '@playwright/test';

test.describe('js-validation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fixture.html');
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.click('#submit-btn');

    const username = page.locator('#username');
    await expect(username).toHaveClass(/is-invalid/);
    await expect(username).toHaveAttribute('invalid', 'true');
    await expect(username).toHaveAttribute('aria-invalid', 'true');

    const email = page.locator('#email');
    await expect(email).toHaveClass(/is-invalid/);

    const password = page.locator('#password');
    await expect(password).toHaveClass(/is-invalid/);

    // Status should NOT show success
    await expect(page.locator('#status')).toHaveText('');
  });

  test('displays error element below invalid field', async ({ page }) => {
    await page.click('#submit-btn');

    const errorEl = page.locator('[data-jsv-error-for="username"]');
    await expect(errorEl).toBeVisible();
    await expect(errorEl).toHaveClass('invalid-feedback');
    await expect(errorEl).toHaveText('This field is required.');
  });

  test('removes error element when field becomes valid', async ({ page }) => {
    await page.click('#submit-btn');

    const errorEl = page.locator('[data-jsv-error-for="username"]');
    await expect(errorEl).toBeVisible();

    await page.fill('#username', 'testuser');
    await expect(errorEl).not.toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'invalid-email');
    await page.fill('#password', 'secret123');
    await page.fill('#confirmPassword', 'secret123');
    await page.click('#submit-btn');

    const email = page.locator('#email');
    await expect(email).toHaveClass(/is-invalid/);
    await expect(email).toHaveAttribute('invalid', 'true');
    await expect(page.locator('#status')).toHaveText('');
  });

  test('validates minlength', async ({ page }) => {
    await page.fill('#username', 'ab');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'secret123');
    await page.fill('#confirmPassword', 'secret123');
    await page.click('#submit-btn');

    const username = page.locator('#username');
    await expect(username).toHaveClass(/is-invalid/);
    await expect(page.locator('#status')).toHaveText('');
  });

  test('validates equalTo (password confirmation)', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'secret123');
    await page.fill('#confirmPassword', 'different');
    await page.click('#submit-btn');

    const confirm = page.locator('#confirmPassword');
    await expect(confirm).toHaveClass(/is-invalid/);
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
    await expect(page.locator('#username')).toHaveClass(/is-invalid/);

    // Fill valid data - input event should clear error
    await page.fill('#username', 'testuser');
    await expect(page.locator('#username')).not.toHaveClass(/is-invalid/);
    await expect(page.locator('#username')).not.toHaveAttribute('invalid');
  });

  test('real-time validation on input event', async ({ page }) => {
    await page.fill('#username', 'usr');
    await page.fill('#email', 'notvalid');
    await page.click('#submit-btn');

    await expect(page.locator('#email')).toHaveClass(/is-invalid/);

    // Fix the email
    await page.fill('#email', 'user@example.com');
    await expect(page.locator('#email')).not.toHaveClass(/is-invalid/);
  });
});
