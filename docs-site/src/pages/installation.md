---
layout: ../layouts/DocsLayout.astro
title: "Installation"
description: "CDN, npm, and manual install methods for js-validation."
---

# Installation

## NPM

```bash
npm install @phpdevsr/js-validation
```

Then import it in your project:

```js
import jsValidation from '@phpdevsr/js-validation';
```

## CDN (jsDelivr)

### Latest version

```html
<script src="https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.min.js"></script>
```

### Specific version

```html
<script src="https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation@1.1.0/dist/js-validation.min.js"></script>
```

### ES Module via CDN

```html
<script type="module">
  import jsValidation from 'https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.esm.min.js';
</script>
```

## Download

You can also download the files directly from the [GitHub Releases](https://github.com/PHPDevsr/js-validation/releases) page and include them in your project manually.

## Available Files

| File | Format | Description |
|------|--------|-------------|
| `dist/js-validation.js` | UMD | Unminified, for development |
| `dist/js-validation.min.js` | UMD | Minified, for production |
| `dist/js-validation.esm.js` | ES Module | Unminified, for bundlers |
| `dist/js-validation.esm.min.js` | ES Module | Minified, for bundlers |

## Usage After Installation

### UMD (Script Tag)

```html
<script src="dist/js-validation.min.js"></script>
<script>
  const validator = jsValidation.default('#my-form', {
    rules: { email: { required: true, email: true } }
  });
</script>
```

### ES Module

```js
import jsValidation from '@phpdevsr/js-validation';

const validator = jsValidation('#my-form', {
  rules: { email: { required: true, email: true } }
});
```

### Selective Import (Core + Specific Rules)

```js
import jsValidation from '@phpdevsr/js-validation/core';
import '@phpdevsr/js-validation/rules/required';
import '@phpdevsr/js-validation/rules/email';
```
