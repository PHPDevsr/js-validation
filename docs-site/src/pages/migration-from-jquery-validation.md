---
layout: ../layouts/DocsLayout.astro
title: "Migration from jquery-validation"
description: "Learn how to migrate from jquery-validation to js-validation."
---

# Migration from jquery-validation

## Overview

`js-validation` is inspired by `jquery-validation` but built for modern JavaScript applications without requiring jQuery.

This guide helps you migrate existing forms from `jquery-validation` to `@phpdevsr/js-validation`.

## Why Migrate?

Modern frontend applications often no longer use jQuery. Migrating to `js-validation` gives you:

- Zero dependency validation
- Smaller bundle size
- Modern ESM support
- Better compatibility with Vite and modern tooling
- Simpler integration with modern frameworks

## Installation

### jquery-validation

```html
<script src="jquery.js"></script>
<script src="jquery.validate.min.js"></script>
````

### js-validation

```bash
npm install @phpdevsr/js-validation
```

Or using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.min.js"></script>
```

## Basic Validation

### jquery-validation

```js
$("#my-form").validate({
  rules: {
    name: {
      required: true
    },
    email: {
      required: true,
      email: true
    }
  }
});
```

### js-validation

```js
const validator = jsValidation('#my-form', {
  rules: {
    name: {
      required: true
    },
    email: {
      required: true,
      email: true
    }
  }
});
```

## Custom Rules

### jquery-validation

```js
$.validator.addMethod(
  "startsWithA",
  function(value) {
    return value.startsWith("A");
  },
  "Must start with letter A."
);

$("#my-form").validate({
  rules: {
    name: {
      required: true,
      startsWithA: true
    }
  }
});
```

### js-validation

```js
// Rule that checks if value starts with a specific letter
jsValidation.addMethod(
  'startsWithA',
  (value) => value.startsWith('A'),
  'Must start with letter A.'
);

// Usage
const validator = jsValidation('#my-form', {
  rules: {
    name: {
      required: true,
      startsWithA: true
    }
  }
});
```

## Event Handling

### jquery-validation

```js
$("#my-form").on("submit", function(e) {
  e.preventDefault();
});
```

### js-validation

```js
jsValidation.default('#my-form').submit(function (e) {
  e.preventDefault();
});
```

## Key Differences

| Feature                 | jquery-validation | js-validation |
| ----------------------- | ----------------- | ------------- |
| Requires jQuery         | Yes               | No            |
| Zero dependency         | No                | Yes           |
| ESM support             | Limited           | Yes           |
| Modern bundler friendly | Partial           | Yes           |
| Tree shaking            | No                | Yes           |

## Migration Tips

### Replace `.validate()`

#### jquery-validation

```js
$("#my-form").validate({...});
```

#### js-validation

```js
jsValidation("#my-form", {...});
```

---

### Replace `$.validator.addMethod()`

#### jquery-validation

```js
$.validator.addMethod(...);
```

#### js-validation

```js
jsValidation.addMethod(...);
```

---

### Replace jQuery Selectors

#### jquery-validation

```js
$("#my-form")
```

#### js-validation

```js
document.querySelector("#my-form")
```

## Common Migration Example

### Before (jquery-validation)

```js
$("#register-form").validate({
  rules: {
    username: {
      required: true,
      minlength: 3
    },
    password: {
      required: true,
      minlength: 6
    }
  }
});
```

### After (js-validation)

```js
const validator = jsValidation('#register-form', {
  rules: {
    username: {
      required: true,
      minlength: 3
    },
    password: {
      required: true,
      minlength: 6
    }
  }
});
```

## Best Practices

1. Use native DOM APIs instead of jQuery helpers.
2. Import only what you need in modular applications.
3. Keep validation rules framework-agnostic.
4. Use custom rules for reusable business logic.
5. Remove unused jQuery plugins after migration.

## See Also

* [Getting Started](/js-validation/getting-started/) – Basic setup and usage.
* [Custom Rules](/js-validation/custom-rules/) – Create your own validation rules.
* [Rules List](/js-validation/rules/) – All built-in validation rules.
