---
layout: ../layouts/DocsLayout.astro
title: "E2E Testing"
description: "End-to-End (E2E) Testing for js-validation."
---

# End-to-End (E2E) Testing

`js-validation` uses [Playwright](https://playwright.dev/) for browser-level end-to-end tests. These tests verify validation behaviour in a real browser environment against static HTML fixture pages served by Vite.

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | `^1.60.0` | Test runner & browser automation |
| [Vite](https://vite.dev/) | `^8.0.14` | Dev server serving fixture pages |

Browsers tested: **Chromium**, **Firefox**, **WebKit** (Safari engine).

## Configuration

### Playwright (`playwright.config.js`)

```js
export default defineConfig({
  fullyParallel: true,
  testDir: './test/e2e',
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npx vite --port 5174 --config vite.config.e2e.js',
    port: 5174,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Vite E2E Server (`vite.config.e2e.js`)

```js
export default defineConfig({
  root: resolve(__dirname, 'test/e2e'),
  server: { port: 5174 },
  resolve: {
    alias: { '/src': resolve(__dirname, 'src') },
  },
});
```

The server root is `test/e2e/`, so a test calling `page.goto('/fixture.html')` loads `test/e2e/fixture.html`, and `page.goto('/alpha/fixture.html')` loads `test/e2e/alpha/fixture.html`.

## Running Tests

```bash
# Run all E2E tests (all 3 browsers)
npm run test:e2e

# Run unit tests (Vitest)
npm test
```

On CI Playwright always starts a fresh server. Locally it reuses an existing server on port `5174` if one is already running.

## Directory Structure

```
test/e2e/
├── fixture.html          ← Shared base fixture (multi-rule form)
├── validation.spec.js    ← Tests for the shared fixture
├── alpha/
│   ├── fixture.html      ← Fixture for the alpha rule
│   └── alpha.spec.js     ← Tests for the alpha rule
├── email/
│   ├── fixture.html
│   └── email.spec.js
├── locales/
│   ├── fixture.html      ← Fixture for localization tests
│   └── locales.spec.js   ← Tests for locale switching
├── minlength/
├── maxlength/
├── required/
└── … (one sub-directory per rule)
```

## Fixture Page Pattern

A fixture page is a minimal HTML file that:

1. Renders a `<form novalidate>` with the relevant input(s)
2. Imports `js-validation` from `/src/index.js`
3. Initialises the validator with rules and an optional submit handler
4. Exposes a `#status` element that shows `'Form submitted successfully!'` on success

### Shared fixture (`test/e2e/fixture.html`)

```html
<form id="test-form" novalidate>
  <div><input name="username" id="username" type="text" /></div>
  <div><input name="email"    id="email"    type="text" /></div>
  <div><input name="password" id="password" type="password" /></div>
  <div><input name="confirmPassword" id="confirmPassword" type="password" /></div>
  <button type="submit" id="submit-btn">Submit</button>
</form>
<p id="status"></p>

<script type="module">
  import jsValidation from '/src/index.js';

  jsValidation('#test-form', {
    rules: {
      username:        { required: true, minlength: 3 },
      email:           { required: true, email: true },
      password:        { required: true, minlength: 6 },
      confirmPassword: { required: true, equalTo: '#password' }
    },
    messages: {
      confirmPassword: { equalTo: 'Passwords must match.' }
    }
  }).submit(() => {
    document.getElementById('status').textContent = 'Form submitted successfully!';
  });
</script>
```

### Rule-specific fixture (`test/e2e/alpha/fixture.html`)

```html
<form id="test-form" novalidate>
  <div><input name="field" id="field" type="text" /></div>
  <button type="submit" id="submit-btn">Submit</button>
</form>
<p id="status"></p>

<script type="module">
  import jsValidation from '/src/index.js';

  jsValidation('#test-form', {
    rules: { field: { required: true, alpha: true } },
    messages: { field: { alpha: 'Please enter only alphabetic letters.' } }
  }).submit(() => {
    document.getElementById('status').textContent = 'Form submitted successfully!';
  });
</script>
```

## Writing Specs

Place specs inside `test/e2e/<rule-name>/<rule-name>.spec.js` for rule-specific tests, or in `test/e2e/validation.spec.js` for cross-cutting concerns.

### Anatomy of a spec file

```js
import { test, expect } from '@playwright/test';

test.describe('E2E: <rule> rule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/<rule>/fixture.html');
  });

  test('fails for invalid value', async ({ page }) => {
    await page.fill('#field', 'bad-value');
    await page.click('#submit-btn');
    await expect(page.locator('#field')).toHaveClass(/is-invalid/);
  });

  test('passes for valid value', async ({ page }) => {
    await page.fill('#field', 'good-value');
    await page.click('#submit-btn');
    await expect(page.locator('#status')).toHaveText('Form submitted successfully!');
  });
});
```

### Key DOM contracts

| What | Assertion |
|------|-----------|
| Field is invalid | `toHaveClass(/is-invalid/)` |
| ARIA accessibility | `toHaveAttribute('aria-invalid', 'true')` |
| HTML invalid attribute | `toHaveAttribute('invalid', 'true')` |
| Error message on field | `toHaveAttribute('data-jsv-message', '<msg>')` |
| Inline error element visible | `page.locator('[data-jsv-error-for="<name>"]').toBeVisible()` |
| Error element text | `toHaveText('<message>')` |
| Successful submission | `page.locator('#status').toHaveText('Form submitted successfully!')` |

## Test Coverage — Shared Fixture

| # | Test | What it verifies |
|---|------|-----------------|
| 1 | Shows validation errors on empty submit | `is-invalid`, `invalid`, `aria-invalid` on all fields |
| 2 | Displays error element below invalid field | `[data-jsv-error-for]` element visible with correct text |
| 3 | Removes error element when field becomes valid | Error element hidden after typing |
| 4 | Validates email format | `is-invalid` on malformed email |
| 5 | Validates minlength | `is-invalid` when below minimum length |
| 6 | Validates equalTo (password confirmation) | `is-invalid` when passwords don't match |
| 7 | Submits successfully when all fields valid | `#status` shows success message |
| 8 | Clears errors on valid input after failed submit | `is-invalid` removed, `invalid` attribute removed |
| 9 | Real-time validation on input event | Error clears immediately when field becomes valid while typing |

## Test Coverage — Locales

| # | Test | What it verifies |
|---|------|-----------------|
| 1 | English error for required (default) | `This field is required.` |
| 2 | English error for invalid email (default) | `Please enter a valid email address.` |
| 3 | Spanish error for required | `Este campo es obligatorio.` |
| 4 | Spanish error for invalid email | `Por favor ingrese una dirección de correo electrónico válida.` |
| 5 | Switch from English to Spanish on re-init | Locale changes dynamically |
| 6 | Unknown lang falls back to English | `lang: 'zz'` shows English |
| 7 | Missing key in active locale falls back | Partial locale returns English for missing keys |
| 8 | Runtime registration of a new locale | `addLocaleMessages('fr', …)` works |
| 9 | Custom message overrides locale | `messages` option takes priority |

## Adding E2E Tests for a New Rule

1. **Create a fixture** at `test/e2e/<rule>/fixture.html` (copy an existing one and adapt the rules).
2. **Create a spec** at `test/e2e/<rule>/<rule>.spec.js`.
3. Run `npm run test:e2e` to verify.

### Checklist for a complete spec

- [ ] Fails for each documented invalid input variant
- [ ] Passes for each valid input variant
- [ ] Verifies `is-invalid` class added/removed correctly
- [ ] Verifies `data-jsv-message` attribute on failure
- [ ] Verifies inline error element (`[data-jsv-error-for]`) visibility
- [ ] Verifies successful form submission path

## Debugging Tips

| Scenario | How |
|----------|-----|
| Run a single spec | `npx playwright test test/e2e/alpha/alpha.spec.js` |
| Run one browser only | `npx playwright test --project=chromium` |
| Run in headed mode | `npx playwright test --headed` |
| Slow motion | `npx playwright test --headed --slow-mo=500` |
| Open Playwright UI | `npx playwright test --ui` |
| Show test report | `npx playwright show-report` |
| Debug interactively | `npx playwright test --debug` |
