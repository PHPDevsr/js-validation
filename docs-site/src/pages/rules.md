---
layout: ../layouts/DocsLayout.astro
title: "Rules"
description: "All built-in validation rules and their options for js-validation."
---

# Rules List

## Built-in Rules

The following validation rules are included with **js-validation**:

### `required`

Validates that the field has a non-empty value (after trimming whitespace).

```js
rules: {
  name: { required: true }
}
```

**Default message:** `"This field is required."`

---

### `email`

Validates that the value is a properly formatted email address.

```js
rules: {
  email: { required: true, email: true }
}
```

**Default message:** `"Please enter a valid email address."`

---

### `url`

Validates that the value is a properly formatted URL.

```js
rules: {
  url: { required: true, url: true }
}
```

**Default message:** `"Please enter a valid URL."`

---

### `date`

Validates that the value can be parsed as a valid date.

```js
rules: {
  birthday: { date: true }
}
```

**Default message:** `"Please enter a valid date."`

---

### `dateISO`

Validates that the value matches ISO-like date format (`YYYY-MM-DD` or `YYYY/MM/DD`).

```js
rules: {
  startDate: { dateISO: true }
}
```

**Default message:** `"Please enter a valid ISO date (YYYY-MM-DD)."`

---

### `minlength`

Validates that the value has at least the specified number of characters.

```js
rules: {
  password: { minlength: 6 }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `minlength` | `number` | Minimum number of characters |

**Default message:** `"Please enter at least {0} characters."`

---

### `maxlength`

Validates that the value has no more than the specified number of characters.

```js
rules: {
  username: { maxlength: 20 }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `maxlength` | `number` | Maximum number of characters |

**Default message:** `"Please enter no more than {0} characters."`

---

### `range`

Validates that the numeric value is between a minimum and maximum (inclusive).

```js
rules: {
  age: { range: [18, 65] }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `range` | `[number, number]` | Array of `[min, max]` allowed values |

**Default message:** `"Please enter a value between {0} and {1}."`

**Invalid format message:** `"Please enter a valid range."`

> **Wrong format cases** — the rule returns `false` and the invalid format message is shown when:
> - `range` is a single number (e.g. `range: 5`)
> - `range` is an array with fewer than two elements (e.g. `range: [2]`)
> - `range` is an unparseable string (e.g. `range: 'invalid'`)
> - `range` is `null` or any other non-array value

---

### `pattern`

Validates that the value matches a regular expression pattern.

```js
rules: {
  zipcode: { pattern: '^[0-9]{5}$' }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pattern` | `string` | Regular expression pattern (without delimiters) |

**Default message:** `"Please match the requested format."`

---

### `equalTo`

Validates that the value matches the value of another field (useful for password confirmation).

```js
rules: {
  confirmPassword: { equalTo: '#password' }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `equalTo` | `string` | CSS selector of the field to compare against |

**Default message:** `"Please enter the same value again."`

---

### `numeric`

Validates that the value contains only numeric digits (0-9).

```js
rules: {
  age: { numeric: true }
}
```

**Default message:** `"Please enter only numeric values."`

---

## Using Rules via HTML Attributes

All rules can also be declared using `data-rule-*` attributes:

```html
<input name="email" data-rule-required="true" data-rule-email="true" />
<input name="password" data-rule-required="true" data-rule-minlength="6" />
<input name="zipcode" data-rule-pattern="^[0-9]{5}$" />
```

## Custom Error Messages via HTML

Use `data-msg-*` attributes to override default messages:

```html
<input
  name="email"
  data-rule-required="true"
  data-msg-required="Email is required!"
/>
```

## Combining Rules

Multiple rules can be applied to a single field. They are evaluated in order:

```js
rules: {
  username: {
    required: true,
    minlength: 3,
    maxlength: 20,
    pattern: '^[a-zA-Z0-9_]+$'
  }
}
```

## Rule Evaluation

- Rules are evaluated in the order they are defined.
- Validation stops at the first failing rule for each field.
- A rule with a value of `false` or `"false"` is skipped.

## See Also

- [Custom Rules](/js-validation/custom-rules/) – How to create your own validation rules.
