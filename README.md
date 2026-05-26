# js-validation

[![NPM Version](https://img.shields.io/npm/v/@phpdevsr/js-validation)](https://www.npmjs.com/package/@phpdevsr/js-validation)
[![CI](https://github.com/PHPDevsr/js-validation/actions/workflows/ci.yml/badge.svg)](https://github.com/PHPDevsr/js-validation/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

Vanilla JavaScript (pure JS) form validation inspired by [`jquery-validation`](https://github.com/jquery-validation/jquery-validation/).

## Features

- No dependency (pure JS)
- Modular rules – each rule lives in its own file under `src/rules/`
- Built-in rules: `required`, `email`, `minlength`, `maxlength`, `pattern`, `equalTo`
- Extensible with custom rules via `addMethod`
- Build with **Vite** – outputs `js-validation.js` and `js-validation.min.js`
- Test with **Vitest**

## Installation

### NPM

```bash
npm install @phpdevsr/js-validation
```

### CDN (jsDelivr)

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation@1.0.0/dist/js-validation.min.js"></script>

<!-- ES module -->
<script type="module">
  import jsValidation from 'https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.esm.min.js';
</script>
```

## Build

```bash
npm run build
```

Produces in `dist/`:
- `js-validation.js` – UMD (unminified)
- `js-validation.min.js` – UMD (minified)
- `js-validation.esm.js` – ES module (unminified)
- `js-validation.esm.min.js` – ES module (minified)

## Test

```bash
npm test
```

## Usage (ES module)

### Default import (all rules included)

```js
import jsValidation from '@phpdevsr/js-validation';

const validator = jsValidation('#signup', {
  rules: {
    email: { required: true, email: true },
    password: { required: true, minlength: 6 },
    confirmPassword: { required: true, equalTo: '#password' }
  },
  messages: {
    confirmPassword: { equalTo: 'Passwords must match.' }
  }
}).submit((form) => {
  // Only fires when all fields are valid
  fetch('/api/signup', { method: 'POST', body: new FormData(form) });
});
```

### Selective import (choose only the rules you need)

```js
// Import core without any rules
import jsValidation from '@phpdevsr/js-validation/core';

// Then import only the specific rules you need
import '@phpdevsr/js-validation/rules/required';
import '@phpdevsr/js-validation/rules/email';

// Available rules: required, email, minlength, maxlength, pattern, equalTo

const validator = jsValidation('#contact', {
  rules: {
    name: { required: true },
    email: { required: true, email: true }
  }
}).submit((form) => {
  fetch('/api/contact', { method: 'POST', body: new FormData(form) });
});
```

## Usage (UMD / browser script tag)

```html
<script src="dist/js-validation.min.js"></script>
<script>
  const validator = jsValidation.default('#signup', { /* rules */ });
</script>
```

## Custom rule

```js
import jsValidation from 'js-validation';

jsValidation.addMethod('startsWithA', (value) => value.startsWith('A'), 'Must start with letter A.');
```

## Project structure

```
src/
  core.js          – Validator engine
  core-entry.js    – Core-only entry point (for selective imports)
  index.js         – Entry point (imports core + all rules)
  rules/
    required.js
    email.js
    minlength.js
    maxlength.js
    pattern.js
    equalTo.js
test/
  js-validation.test.js      – Unit tests (Vitest)
  selective-import.test.js   – Selective import tests
  e2e/
    validation.spec.js       – E2E browser tests (Playwright)
    fixture.html             – Test fixture page
docs/
  index.html       – Demo page (deployed to GitHub Pages)
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): builds with Vite, runs Vitest unit tests, and runs Playwright E2E tests across Chromium, Firefox, and WebKit on PR.
- **CD** (`.github/workflows/release-pages.yml`): on `v*` tag push, builds the bundle, creates a GitHub Release, publishes to NPM, and deploys to GitHub Pages.

## CDN

After publishing to NPM, the library is automatically available via [jsDelivr](https://www.jsdelivr.com/):

```
https://cdn.jsdelivr.net/npm/js-validation/dist/js-validation.min.js
```

