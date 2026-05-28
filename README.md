<p align="center">
  <br>
  <br>
  <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://js-validation.js.org/favicon.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://js-validation.js.org/favicon.svg">
      <img alt="vite logo" src="https://js-validation.js.org/favicon.svg" height="190">
    </picture>
  </a>
  <br>
  <br>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/@phpdevsr/js-validation"><img src="https://img.shields.io/npm/v/@phpdevsr/js-validation" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/@phpdevsr/js-validation" alt="node compatibility"></a>
  <a href="https://github.com/PHPDevsr/js-validation/actions/workflows/ci.yml"><img src="https://github.com/PHPDevsr/js-validation/actions/workflows/ci.yml/badge.svg" alt="build status"></a>
</p>
<br/>

# js-validation

Lightweight, zero-dependency vanilla JavaScript form validation library inspired by [`jquery-validation`](https://github.com/jquery-validation/jquery-validation/).

## Features

- No dependency (pure JS)
- Modular rules – each rule lives in its own file under `src/rules/`
- Built-in rules: `required`, `email`, `minlength`, `maxlength`, `pattern`, `equalTo`, `numeric`, `url`, `date`, `dateISO`, [`etc`](https://js-validation.js.org/rules/)
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

// Available rules: required, email, minlength, maxlength, pattern, equalTo, numeric, url, date, dateISO

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

## Contributing

We **are** accepting contributions from the community! It doesn't matter whether you can code, write documentation, or help find bugs,
all contributions are welcome.

Please read the [*CONTRIBUTING.md*](https://github.com/PHPDevsr/js-validation/blob/develop/CONTRIBUTING.md).

This project has had thousands on contributions from people since its creation. This project would not be what it is without them.

<a href="https://github.com/PHPDevsr/js-validation/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=PHPDevsr/js-validation" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
