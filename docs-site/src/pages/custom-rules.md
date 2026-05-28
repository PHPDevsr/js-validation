---
layout: ../layouts/DocsLayout.astro
title: "Custom Rules"
description: "Create your own validation rules with addMethod() in js-validation."
---

# Custom Rules

## Overview

**js-validation** is designed to be extensible. You can add your own validation rules using the `addMethod` API.

## Adding a Custom Rule

### Syntax

```js
jsValidation.addMethod(name, validateFn, message);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Unique rule name |
| `validateFn` | `function` | Validation function: `(value, param, field, validator) => boolean` |
| `message` | `string \| function` | Error message string or function returning a message |

### Validation Function Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `string` | Current field value |
| `param` | `any` | The rule parameter (e.g., `true`, a number, a selector) |
| `field` | `HTMLElement` | The input element being validated |
| `validator` | `VanillaValidator` | The validator instance |

The function must return `true` if the value is valid, or `false` if invalid.

## Examples

### Simple Rule

```js
import jsValidation from '@phpdevsr/js-validation';

// Rule that checks if value starts with a specific letter
jsValidation.addMethod(
  'startsWithA',
  (value) => value.startsWith('A'),
  'Must start with letter A.'
);

// Usage
const validator = jsValidation('#my-form', {
  rules: {
    name: { required: true, startsWithA: true }
  }
});
```

### Rule with Parameter

```js
// Rule that checks minimum word count
jsValidation.addMethod(
  'minwords',
  (value, param) => {
    const wordCount = value.trim().split(/\s+/).length;
    return wordCount >= param;
  },
  'Please enter at least {0} words.'
);

// Usage
const validator = jsValidation('#my-form', {
  rules: {
    bio: { required: true, minwords: 10 }
  }
});
```

### Rule with Dynamic Message

```js
// Rule with a function-based message
jsValidation.addMethod(
  'notEqualTo',
  (value, param) => {
    const otherField = document.querySelector(param);
    return !otherField || value !== otherField.value;
  },
  (param, field) => `This field must be different from ${param}.`
);
```

### Rule Using Other Fields

```js
// Rule that validates based on another field's value
jsValidation.addMethod(
  'requiredIf',
  (value, param, field, validator) => {
    const otherField = validator.form.querySelector(`[name="${param}"]`);
    if (otherField && otherField.value.trim() !== '') {
      return value.trim().length > 0;
    }
    return true; // Not required if other field is empty
  },
  'This field is required.'
);

// Usage: "address" is required only if "city" is filled
const validator = jsValidation('#my-form', {
  rules: {
    address: { requiredIf: 'city' }
  }
});
```

## Creating a Rule as a Separate Module

For reusable rules, create a separate file following the same pattern as built-in rules:

```js
// my-rules/phone.js
import { VanillaValidator } from '@phpdevsr/js-validation/core';

VanillaValidator.addMethod(
  'phone',
  (value) => {
    if (String(value || '').trim() === '') return true; // Allow empty (use required for mandatory)
    return /^\+?[\d\s\-()]{7,15}$/.test(value);
  },
  'Please enter a valid phone number.'
);
```

Then import it in your application:

```js
import jsValidation from '@phpdevsr/js-validation/core';
import '@phpdevsr/js-validation/rules/required';
import './my-rules/phone.js';
```

## Best Practices

1. **Return `true` for empty values** if the rule is not about presence. Use `required` for mandatory fields.
2. **Use meaningful rule names** that describe what they validate.
3. **Provide clear error messages** that tell the user what is expected.
4. **Keep rules focused** – each rule should validate one thing.
5. **Handle edge cases** – consider `null`, `undefined`, and empty string inputs.

## See Also

- [Rules List](/rules/) – All built-in validation rules.
- [Getting Started](/getting-started/) – Basic usage guide.
