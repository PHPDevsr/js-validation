import { test, expect } from '@playwright/test';

test.describe('E2E: Localization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/locales/fixture.html');
  });

  // ─── Default locale (en) ──────────────────────────────────────────────────

  test('shows English error for required (default lang)', async ({ page }) => {
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('This field is required.');
  });

  test('shows English error for invalid email (default lang)', async ({ page }) => {
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'not-an-email');
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="email"]'))
      .toHaveText('Please enter a valid email address.');
  });

  // ─── Spanish locale (es) ──────────────────────────────────────────────────

  test('shows Spanish error for required when lang=es', async ({ page }) => {
    await page.evaluate(() => window.initValidator({ lang: 'es' }));
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('Este campo es obligatorio.');
  });

  test('shows Spanish error for invalid email when lang=es', async ({ page }) => {
    await page.evaluate(() => window.initValidator({ lang: 'es' }));
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'bad-email');
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="email"]'))
      .toHaveText('Por favor ingrese una dirección de correo electrónico válida.');
  });

  // ─── Locale switch ────────────────────────────────────────────────────────

  test('switches from English to Spanish when re-initialised', async ({ page }) => {
    // First submit with English
    await page.click('#submit-btn');
    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('This field is required.');

    // Re-init with Spanish
    await page.evaluate(() => window.initValidator({ lang: 'es' }));
    await page.click('#submit-btn');
    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('Este campo es obligatorio.');
  });

  // ─── Fallback to English ──────────────────────────────────────────────────

  test('falls back to English when lang is unknown', async ({ page }) => {
    await page.evaluate(() => window.initValidator({ lang: 'zz' }));
    await page.click('#submit-btn');

    // Unknown locale → falls back to 'en'
    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('This field is required.');
  });

  test('falls back to English for a key missing in the active locale', async ({ page }) => {
    await page.evaluate(() => {
      // Register a locale that only covers 'required', not 'email'
      window.VanillaValidator.addLocaleMessages('partial', {
        required: 'Field required (partial locale).',
        // email intentionally omitted → should fall back to English
      });
      window.initValidator({ lang: 'partial' });
    });

    await page.fill('#username', 'testuser');
    await page.fill('#email', 'bad-email');
    await page.click('#submit-btn');

    // email key is missing in 'partial' → falls back to English
    await expect(page.locator('[data-jsv-error-for="email"]'))
      .toHaveText('Please enter a valid email address.');
  });

  // ─── Runtime locale registration ─────────────────────────────────────────

  test('supports runtime registration of a new locale', async ({ page }) => {
    await page.evaluate(() => {
      window.VanillaValidator.addLocaleMessages('fr', {
        required: 'Ce champ est obligatoire.',
        email: 'Veuillez entrer une adresse e-mail valide.',
      });
      window.initValidator({ lang: 'fr' });
    });
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('Ce champ est obligatoire.');
  });

  test('shows correct dynamic message from new locale for email', async ({ page }) => {
    await page.evaluate(() => {
      window.VanillaValidator.addLocaleMessages('fr', {
        required: 'Ce champ est obligatoire.',
        email: 'Veuillez entrer une adresse e-mail valide.',
      });
      window.initValidator({ lang: 'fr' });
    });

    await page.fill('#username', 'testuser');
    await page.fill('#email', 'invalid');
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="email"]'))
      .toHaveText('Veuillez entrer une adresse e-mail valide.');
  });

  test('jsValidation.addLocaleMessages registers a locale', async ({ page }) => {
    await page.evaluate(() => {
      window.jsValidation.addLocaleMessages('de', {
        required: 'Dieses Feld ist erforderlich.',
      });
      window.initValidator({ lang: 'de' });
    });
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('Dieses Feld ist erforderlich.');
  });

  // ─── Custom messages override locale ─────────────────────────────────────

  test('custom field message overrides locale message', async ({ page }) => {
    await page.evaluate(() => {
      window.initValidator({
        lang: 'es',
        messages: {
          username: { required: 'Custom override message.' },
        },
      });
    });
    await page.click('#submit-btn');

    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('Custom override message.');
  });

  test('custom message overrides even while other fields use the locale', async ({ page }) => {
    await page.evaluate(() => {
      window.initValidator({
        lang: 'es',
        messages: {
          username: { required: 'Override only for username.' },
          // email has no custom override → should use Spanish
        },
      });
    });
    await page.click('#submit-btn');

    // Username uses the custom override
    await expect(page.locator('[data-jsv-error-for="username"]'))
      .toHaveText('Override only for username.');

    // Email still uses the Spanish locale
    await page.fill('#email', 'bad');
    await page.click('#submit-btn');
    await expect(page.locator('[data-jsv-error-for="email"]'))
      .toHaveText('Por favor ingrese una dirección de correo electrónico válida.');
  });

  // ─── Successful submission ────────────────────────────────────────────────

  test('submits successfully in Spanish locale with valid inputs', async ({ page }) => {
    await page.evaluate(() => window.initValidator({ lang: 'es' }));
    await page.fill('#username', 'testuser');
    await page.fill('#email', 'user@example.com');
    await page.click('#submit-btn');

    await expect(page.locator('#status'))
      .toHaveText('Form submitted successfully!');
  });
});
