# Getting Started

## Overview

**js-validation** is a lightweight, zero-dependency vanilla JavaScript form validation library. It provides a familiar API inspired by [jquery-validation](https://github.com/jquery-validation/jquery-validation/) — without requiring jQuery.

## Basic Usage

### 1. Include the library

```html
<script src="https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.min.js"></script>
```

### 2. Create a form

```html
<form id="my-form" novalidate>
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button type="submit">Submit</button>
</form>
```

### 3. Initialize validation

```html
<script>
  const validator = jsValidation.default('#my-form', {
    rules: {
      email: { required: true, email: true },
      password: { required: true, minlength: 6 }
    }
  });
</script>
```

## ES Module Usage

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
  fetch('/api/signup', { method: 'POST', body: new FormData(form) });
});
```

## Selective Imports (Tree-Shaking)

Import only the rules you need to reduce bundle size:

```js
import jsValidation from '@phpdevsr/js-validation/core';
import '@phpdevsr/js-validation/rules/required';
import '@phpdevsr/js-validation/rules/email';

const validator = jsValidation('#contact', {
  rules: {
    name: { required: true },
    email: { required: true, email: true }
  }
}).submit((form) => {
  fetch('/api/contact', { method: 'POST', body: new FormData(form) });
});
```

## Using HTML Data Attributes

You can declare rules directly in HTML using `data-rule-*` attributes:

```html
<form id="signup-form" novalidate>
  <input name="email" data-rule-required="true" data-rule-email="true" />
  <input name="password" type="password" data-rule-required="true" data-rule-minlength="6" />
  <button type="submit">Submit</button>
</form>

<script>
  const validator = jsValidation.default('#signup-form', {});
</script>
```

## API Reference

### `jsValidation(formOrSelector, options)`

Creates a validator instance.

| Parameter | Type | Description |
|-----------|------|-------------|
| `formOrSelector` | `string \| HTMLFormElement` | CSS selector or form element |
| `options` | `object` | Configuration object |

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `rules` | `object` | Field-name-keyed validation rules |
| `messages` | `object` | Custom error messages per field/rule |
| `onkeyup` | `boolean` | Set to `false` to disable real-time validation on input |
| `errorClass` | `string` | CSS class added to invalid fields (default: `'is-invalid'`) |
| `errorElement` | `string` | HTML tag for the error message element (default: `'span'`) |
| `errorElementClass` | `string` | CSS class for the error message element (default: `'invalid-feedback'`) |

#### Instance Methods

| Method | Description |
|--------|-------------|
| `.submit(handler)` | Register submit handler (called when form is valid) |
| `.validate()` | Validate all fields; returns `true` if valid |
| `.resetForm()` | Clear all validation errors |
| `.element(field)` | Validate a single field element |

### `jsValidation.addMethod(name, validateFn, message)`

Register a custom validation rule globally.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Rule name |
| `validateFn` | `function` | `(value, param, field, validator) => boolean` |
| `message` | `string \| function` | Error message or function returning one |

## Error Display

When a field fails validation:

- The CSS class `is-invalid` is added to the field (configurable via `errorClass` option)
- The `aria-invalid` attribute is set to `"true"`
- The `invalid` attribute is set to `"true"`
- The error message is stored in `data-jsv-message` attribute
- An error element (`<span class="invalid-feedback">`) is inserted after the field displaying the error message

When a field passes validation:

- The `is-invalid` class is removed
- `aria-invalid` is set to `"false"`
- The `invalid` attribute is removed
- `data-jsv-message` is removed
- The error element is removed

### Customizing Error Display

```js
jsValidation('#my-form', {
  rules: { name: { required: true } },
  errorClass: 'my-error-class',          // default: 'is-invalid'
  errorElement: 'div',                    // default: 'span'
  errorElementClass: 'my-error-message'   // default: 'invalid-feedback'
});
```

## Next Steps

- See the full [Rules List](rules.md)
- Learn how to create [Custom Rules](custom-rules.md)
- Check [Installation](installation.md) for all install methods
