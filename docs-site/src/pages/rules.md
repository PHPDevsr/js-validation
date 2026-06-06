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

### `time`

Validates time in `H:MM`, `HH:MM`, or `HH:MM:SS` format.

> Available since `v1.4.0`.

```js
rules: {
  startTime: { time: true }
}
```

**Default message:** `"Please enter a valid time (HH:MM or HH:MM:SS)."`

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

### `notEqualTo`

Validates that the value is different from the value of another field. Useful for requiring a new value, such as a new password that must differ from the current password.

> Available since `v1.3.0`.

```js
rules: {
  newPassword: { notEqualTo: '#currentPassword' }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `notEqualTo` | `string` | CSS selector of the field to compare against |

**Default message:** `"Please enter a different value."`

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

### `ipv4`

Validates that the value is a properly formatted IPv4 address.

```js
rules: {
  serverIp: { ipv4: true }
}
```

**Default message:** `"Please enter a valid IPv4 address."`

---

### `ipv6`

Validates that the value is a properly formatted IPv6 address. Supports full, compressed, and mixed IPv4-in-IPv6 notations.

```js
rules: {
  serverIp: { ipv6: true }
}
```

**Default message:** `"Please enter a valid IPv6 address."`

---

### `alphanumeric`

Validates that the value contains only letters (a–z, A–Z), digits (0–9), and underscores. Spaces and special characters are not allowed.

```js
rules: {
  username: { alphanumeric: true }
}
```

**Default message:** `"Please enter only letters, numbers, and underscores."`

---

### `alpha`

Validates that the value contains only alphabetic letters (a–z, A–Z). Digits, spaces, underscores, and special characters are not allowed.

> Available since `v1.4.0`.

```js
rules: {
  firstName: { alpha: true }
}
```

**Default message:** `"Please enter only alphabetic letters."`

---

### `ishexcolor`

Validates that the value is a valid CSS hex color. Accepts both 3-digit (e.g. `#fff`) and 6-digit (e.g. `#ffffff`) formats, case-insensitively.

```js
rules: {
  brandColor: { ishexcolor: true }
}
```

**Default message:** `"Please enter a valid hex color (e.g. #fff or #ffffff)."`

---

### `maxfiles`

Validates that a file input does not contain more than the specified number of selected files. Pair it with the `multiple` attribute when users can upload more than one file.

> Available since `v1.3.0`.

```js
rules: {
  attachments: { maxfiles: 3 }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `maxfiles` | `number` | Maximum number of selected files |

**Default message:** `"Please select no more than {0} files."`

---

### `maxsize`

Validates that every selected file is within the specified size limit. The parameter can be a number of bytes or a string using `B`, `KB`, `MB`, or `GB`.

> Available since `v1.3.0`.

```js
rules: {
  attachments: { maxsize: '2MB' }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `maxsize` | `number` or `string` | Maximum size allowed for each selected file |

**Default message:** `"Please select files no larger than {0}."`

### `maxsizetotal`

Validates that all selected file is within the specified size limit. The parameter can be a number of bytes or a string using `B`, `KB`, `MB`, or `GB`.

> Available since `v1.3.0`.

```js
rules: {
  attachments: { maxsizetotal: '2MB' }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `maxsizetotal` | `number` or `string` | Maximum size allowed for all selected file |

**Default message:** `"Total size of all files must not exceed {0}."`

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

- [Custom Rules](/custom-rules/) – How to create your own validation rules.
