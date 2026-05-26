import { test, expect } from '@playwright/test';

test.describe('E2E: All Validation Rules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/all-rules-fixture.html');
  });

  // ─── Required Rule ───────────────────────────────────────────────

  test.describe('required rule', () => {
    test('fails when field is empty', async ({ page }) => {
      await page.click('#submit-btn');
      await expect(page.locator('#requiredField')).toHaveClass(/jsv-invalid/);
    });

    test('fails when field contains only whitespace', async ({ page }) => {
      await page.fill('#requiredField', '   ');
      await page.click('#submit-btn');
      await expect(page.locator('#requiredField')).toHaveClass(/jsv-invalid/);
    });

    test('passes when field has a value', async ({ page }) => {
      await page.fill('#requiredField', 'hello');
      // Trigger validation on the field via input event
      await expect(page.locator('#requiredField')).not.toHaveClass(/jsv-invalid/);
    });
  });

  // ─── Email Rule ──────────────────────────────────────────────────

  test.describe('email rule', () => {
    test('fails for invalid email without @', async ({ page }) => {
      await page.fill('#emailField', 'invalidemail');
      await page.click('#submit-btn');
      await expect(page.locator('#emailField')).toHaveClass(/jsv-invalid/);
    });

    test('fails for email without domain', async ({ page }) => {
      await page.fill('#emailField', 'user@');
      await page.click('#submit-btn');
      await expect(page.locator('#emailField')).toHaveClass(/jsv-invalid/);
    });

    test('fails for email without TLD', async ({ page }) => {
      await page.fill('#emailField', 'user@domain');
      await page.click('#submit-btn');
      await expect(page.locator('#emailField')).toHaveClass(/jsv-invalid/);
    });

    test('passes for valid email', async ({ page }) => {
      await page.fill('#emailField', 'user@example.com');
      await expect(page.locator('#emailField')).not.toHaveClass(/jsv-invalid/);
    });

    test('passes for email with subdomain', async ({ page }) => {
      await page.fill('#emailField', 'user@sub.example.com');
      await expect(page.locator('#emailField')).not.toHaveClass(/jsv-invalid/);
    });
  });

  // ─── Minlength Rule ──────────────────────────────────────────────

  test.describe('minlength rule', () => {
    test('fails when value is shorter than minimum', async ({ page }) => {
      await page.fill('#minlengthField', 'abcd');
      await page.click('#submit-btn');
      await expect(page.locator('#minlengthField')).toHaveClass(/jsv-invalid/);
    });

    test('passes when value meets exact minimum length', async ({ page }) => {
      await page.fill('#minlengthField', 'abcde');
      await expect(page.locator('#minlengthField')).not.toHaveClass(/jsv-invalid/);
    });

    test('passes when value exceeds minimum length', async ({ page }) => {
      await page.fill('#minlengthField', 'abcdefgh');
      await expect(page.locator('#minlengthField')).not.toHaveClass(/jsv-invalid/);
    });
  });

  // ─── Maxlength Rule ──────────────────────────────────────────────

  test.describe('maxlength rule', () => {
    test('fails when value exceeds maximum length', async ({ page }) => {
      await page.fill('#maxlengthField', 'abcdefghijk');
      await page.click('#submit-btn');
      await expect(page.locator('#maxlengthField')).toHaveClass(/jsv-invalid/);
    });

    test('passes when value meets exact maximum length', async ({ page }) => {
      await page.fill('#maxlengthField', 'abcdefghij');
      await expect(page.locator('#maxlengthField')).not.toHaveClass(/jsv-invalid/);
    });

    test('passes when value is shorter than maximum', async ({ page }) => {
      await page.fill('#maxlengthField', 'abc');
      await expect(page.locator('#maxlengthField')).not.toHaveClass(/jsv-invalid/);
    });
  });

  // ─── Numeric Rule ────────────────────────────────────────────────

  test.describe('numeric rule', () => {
    test('fails for alphabetic characters', async ({ page }) => {
      await page.fill('#numericField', 'abc');
      await page.click('#submit-btn');
      await expect(page.locator('#numericField')).toHaveClass(/jsv-invalid/);
    });

    test('fails for mixed alphanumeric', async ({ page }) => {
      await page.fill('#numericField', '123abc');
      await page.click('#submit-btn');
      await expect(page.locator('#numericField')).toHaveClass(/jsv-invalid/);
    });

    test('fails for decimal numbers', async ({ page }) => {
      await page.fill('#numericField', '12.34');
      await page.click('#submit-btn');
      await expect(page.locator('#numericField')).toHaveClass(/jsv-invalid/);
    });

    test('fails for negative numbers', async ({ page }) => {
      await page.fill('#numericField', '-5');
      await page.click('#submit-btn');
      await expect(page.locator('#numericField')).toHaveClass(/jsv-invalid/);
    });

    test('passes for integer digits only', async ({ page }) => {
      await page.fill('#numericField', '12345');
      await expect(page.locator('#numericField')).not.toHaveClass(/jsv-invalid/);
    });

    test('passes for single digit', async ({ page }) => {
      await page.fill('#numericField', '0');
      await expect(page.locator('#numericField')).not.toHaveClass(/jsv-invalid/);
    });
  });

  // ─── Pattern Rule ────────────────────────────────────────────────

  test.describe('pattern rule', () => {
    test('fails when value does not match pattern', async ({ page }) => {
      await page.fill('#patternField', 'invalid');
      await page.click('#submit-btn');
      await expect(page.locator('#patternField')).toHaveClass(/jsv-invalid/);
    });

    test('fails for partial match (missing digits)', async ({ page }) => {
      await page.fill('#patternField', 'ABC-');
      await page.click('#submit-btn');
      await expect(page.locator('#patternField')).toHaveClass(/jsv-invalid/);
    });

    test('fails for wrong case', async ({ page }) => {
      await page.fill('#patternField', 'abc-1234');
      await page.click('#submit-btn');
      await expect(page.locator('#patternField')).toHaveClass(/jsv-invalid/);
    });

    test('passes when value matches pattern exactly', async ({ page }) => {
      await page.fill('#patternField', 'ABC-1234');
      await expect(page.locator('#patternField')).not.toHaveClass(/jsv-invalid/);
    });

    test('passes for another valid pattern match', async ({ page }) => {
      await page.fill('#patternField', 'XYZ-9999');
      await expect(page.locator('#patternField')).not.toHaveClass(/jsv-invalid/);
    });
  });

  // ─── EqualTo Rule ────────────────────────────────────────────────

  test.describe('equalTo rule', () => {
    test('fails when fields do not match', async ({ page }) => {
      await page.fill('#sourceField', 'hello');
      await page.fill('#equalToField', 'world');
      await page.click('#submit-btn');
      await expect(page.locator('#equalToField')).toHaveClass(/jsv-invalid/);
    });

    test('fails when target is empty and source has value', async ({ page }) => {
      await page.fill('#sourceField', 'hello');
      await page.fill('#equalToField', '');
      await page.click('#submit-btn');
      await expect(page.locator('#equalToField')).toHaveClass(/jsv-invalid/);
    });

    test('passes when both fields have the same value', async ({ page }) => {
      await page.fill('#sourceField', 'matching');
      await page.fill('#equalToField', 'matching');
      await expect(page.locator('#equalToField')).not.toHaveClass(/jsv-invalid/);
    });
  });

  // ─── Full Form Submission ────────────────────────────────────────

  test.describe('full form submission', () => {
    test('fails submission when any rule is invalid', async ({ page }) => {
      await page.fill('#requiredField', 'value');
      await page.fill('#emailField', 'user@example.com');
      await page.fill('#minlengthField', 'ab');  // too short
      await page.fill('#maxlengthField', 'ok');
      await page.fill('#numericField', '123');
      await page.fill('#patternField', 'ABC-1234');
      await page.fill('#sourceField', 'match');
      await page.fill('#equalToField', 'match');
      await page.click('#submit-btn');

      await expect(page.locator('#status')).toHaveText('');
      await expect(page.locator('#minlengthField')).toHaveClass(/jsv-invalid/);
    });

    test('submits successfully when all fields are valid', async ({ page }) => {
      await page.fill('#requiredField', 'value');
      await page.fill('#emailField', 'user@example.com');
      await page.fill('#minlengthField', 'abcde');
      await page.fill('#maxlengthField', 'short');
      await page.fill('#numericField', '42');
      await page.fill('#patternField', 'ABC-1234');
      await page.fill('#sourceField', 'secret');
      await page.fill('#equalToField', 'secret');
      await page.click('#submit-btn');

      await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
    });
  });

  // ─── Error Message Verification ──────────────────────────────────

  test.describe('error messages', () => {
    test('displays custom error message for required', async ({ page }) => {
      await page.click('#submit-btn');
      const field = page.locator('#requiredField');
      await expect(field).toHaveAttribute('data-jsv-message', 'Required field is empty.');
    });

    test('displays custom error message for email', async ({ page }) => {
      await page.fill('#emailField', 'notanemail');
      await page.click('#submit-btn');
      const field = page.locator('#emailField');
      await expect(field).toHaveAttribute('data-jsv-message', 'Invalid email format.');
    });

    test('displays custom error message for maxlength', async ({ page }) => {
      await page.fill('#maxlengthField', 'this is way too long');
      await page.click('#submit-btn');
      const field = page.locator('#maxlengthField');
      await expect(field).toHaveAttribute('data-jsv-message', 'Too long.');
    });

    test('displays custom error message for numeric', async ({ page }) => {
      await page.fill('#numericField', 'abc');
      await page.click('#submit-btn');
      const field = page.locator('#numericField');
      await expect(field).toHaveAttribute('data-jsv-message', 'Must be numeric.');
    });

    test('displays custom error message for pattern', async ({ page }) => {
      await page.fill('#patternField', 'wrong');
      await page.click('#submit-btn');
      const field = page.locator('#patternField');
      await expect(field).toHaveAttribute('data-jsv-message', 'Must match format ABC-1234.');
    });

    test('displays custom error message for equalTo', async ({ page }) => {
      await page.fill('#sourceField', 'hello');
      await page.fill('#equalToField', 'different');
      await page.click('#submit-btn');
      const field = page.locator('#equalToField');
      await expect(field).toHaveAttribute('data-jsv-message', 'Fields do not match.');
    });
  });

  // ─── Real-time Validation (input event) ──────────────────────────

  test.describe('real-time validation', () => {
    test('clears error when invalid field becomes valid', async ({ page }) => {
      // Submit to trigger errors
      await page.click('#submit-btn');
      await expect(page.locator('#numericField')).toHaveClass(/jsv-invalid/);

      // Fix the field
      await page.fill('#numericField', '999');
      await expect(page.locator('#numericField')).not.toHaveClass(/jsv-invalid/);
    });

    test('shows error immediately on invalid input after first submit', async ({ page }) => {
      // First submit to activate validation state
      await page.fill('#requiredField', 'x');
      await page.fill('#emailField', 'a@b.c');
      await page.fill('#minlengthField', 'abcde');
      await page.fill('#maxlengthField', 'ok');
      await page.fill('#numericField', '1');
      await page.fill('#patternField', 'ABC-1234');
      await page.fill('#sourceField', 'x');
      await page.fill('#equalToField', 'x');
      await page.click('#submit-btn');
      await expect(page.locator('#status')).toHaveText('Form submitted successfully!');

      // Now type invalid value - real-time validation kicks in
      await page.fill('#numericField', 'notanumber');
      await expect(page.locator('#numericField')).toHaveClass(/jsv-invalid/);
    });
  });
});
