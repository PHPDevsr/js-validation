# Localization

`js-validation` ships with built-in support for multiple languages. Error messages are loaded from locale files and resolved at runtime based on the `lang` option you pass to the validator.

---

## Built-in Locales

| Language | Code | File |
|----------|------|------|
| English  | `en` | `src/locales/en.js` |
| Spanish  | `es` | `src/locales/es.js` |

All built-in locales are automatically registered when you import the full bundle:

```js
import jsValidation from '@phpdevsr/js-validation';
```

---

## Setting the Active Language

Pass the `lang` option when initialising the validator:

```js
const validator = jsValidation('#my-form', {
  lang: 'es'
});
```

If `lang` is omitted, it defaults to `'en'`.

### Fallback Behaviour

When a message key is missing from the active locale, the validator falls back to English (`en`). If the English key is also absent, the method-level default message (`'Please fix this field.'`) is used instead.

Resolution order:

1. Custom message in `options.messages`
2. Active locale (`options.lang`)
3. English locale (`en`) as fallback
4. Method default message

---

## Message Types

Locale messages are plain strings or functions:

```js
// Static string
required: 'This field is required.'

// Dynamic string (receives the rule param as first argument)
minlength: (param) => `Please enter at least ${param} characters.`

// Multi-param (e.g. range uses an array/JSON)
range: (param) => {
  const bounds = Array.isArray(param) ? param : JSON.parse(param);
  return `Please enter a value between ${bounds[0]} and ${bounds[1]}.`;
}
```

---

## All Built-in Message Keys

The following keys must be defined in a locale object:

| Key | Param | Description |
|-----|-------|-------------|
| `required` | — | Field is required |
| `email` | — | Must be a valid email |
| `minlength` | `number` | Minimum character count |
| `maxlength` | `number` | Maximum character count |
| `range` | `[min, max]` | Value within a numeric range |
| `pattern` | — | Must match a regex pattern |
| `equalTo` | — | Must equal another field |
| `notEqualTo` | — | Must differ from another field |
| `numeric` | — | Only numeric values |
| `url` | — | Must be a valid URL |
| `date` | — | Must be a valid date |
| `dateISO` | — | Must be a valid ISO date (`YYYY-MM-DD`) |
| `ipv4` | — | Must be a valid IPv4 address |
| `ipv6` | — | Must be a valid IPv6 address |
| `alpha` | — | Only alphabetic letters |
| `alphanumeric` | — | Letters, numbers, and underscores only |
| `maxfiles` | `number` | Maximum number of files |
| `maxsize` | `string` | Maximum file size |
| `maxsizetotal` | `string` | Maximum total file size |
| `ishexcolor` | — | Must be a valid hex color |
| `time` | — | Must be a valid time (`HH:MM` or `HH:MM:SS`) |

---

## Adding a Custom Locale

### Step 1 – Create the locale file

Create `src/locales/<lang>.js` (replace `<lang>` with your language code):

```js
// src/locales/fr.js
export const fr = {
  required: 'Ce champ est obligatoire.',
  email: 'Veuillez entrer une adresse e-mail valide.',
  minlength: (param) => `Veuillez entrer au moins ${param} caractères.`,
  maxlength: (param) => `Veuillez entrer au plus ${param} caractères.`,
  range: (param) => {
    const bounds = Array.isArray(param) ? param : JSON.parse(param);
    return `Veuillez entrer une valeur entre ${bounds[0]} et ${bounds[1]}.`;
  },
  pattern: 'Veuillez respecter le format demandé.',
  equalTo: 'Veuillez entrer la même valeur.',
  notEqualTo: 'Veuillez entrer une valeur différente.',
  numeric: 'Veuillez entrer uniquement des valeurs numériques.',
  url: 'Veuillez entrer une URL valide.',
  date: 'Veuillez entrer une date valide.',
  dateISO: 'Veuillez entrer une date ISO valide (AAAA-MM-JJ).',
  ipv4: 'Veuillez entrer une adresse IPv4 valide.',
  ipv6: 'Veuillez entrer une adresse IPv6 valide.',
  alpha: 'Veuillez entrer uniquement des lettres.',
  alphanumeric: 'Veuillez entrer uniquement des lettres, chiffres et tirets bas.',
  maxfiles: (param) => `Veuillez sélectionner au plus ${param} fichiers.`,
  maxsize: (param) => `Veuillez sélectionner des fichiers ne dépassant pas ${param}.`,
  maxsizetotal: (param) => `La taille totale ne doit pas dépasser ${param}.`,
  ishexcolor: 'Veuillez entrer une couleur hexadécimale valide (ex. #fff ou #ffffff).',
  time: 'Veuillez entrer une heure valide (HH:MM ou HH:MM:SS).'
};
```

### Step 2 – Register it in `src/locales.js`

```js
// src/locales.js
import { en } from './locales/en.js';
import { es } from './locales/es.js';
import { fr } from './locales/fr.js'; // ← add

export const locales = { en, es, fr }; // ← add to object

export { en, es, fr }; // ← named re-export
```

### Step 3 – Use it

```js
const validator = jsValidation('#my-form', { lang: 'fr' });
```

---

## Runtime Registration (without modifying source)

You can register a locale at runtime without touching the source files. Useful when consuming the published package:

```js
import jsValidation from '@phpdevsr/js-validation';

jsValidation.addLocaleMessages('de', {
  required: 'Dieses Feld ist erforderlich.',
  email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  // ... all other keys
});

const validator = jsValidation('#my-form', { lang: 'de' });
```

The low-level API is also available via `VanillaValidator`:

```js
import { VanillaValidator } from '@phpdevsr/js-validation';

VanillaValidator.addLocaleMessages('de', { /* messages */ });
```

---

## Per-Field Custom Messages

Locale messages can be overridden per field via `options.messages`. These take the highest priority:

```js
jsValidation('#my-form', {
  lang: 'es',
  rules: {
    confirmPassword: { required: true, equalTo: '#password' }
  },
  messages: {
    confirmPassword: { equalTo: 'Las contraseñas no coinciden.' }
  }
});
```

---

## Locale Object Interface

```ts
interface LocaleMessages {
  required?:      string;
  email?:         string;
  minlength?:     string | ((param: number) => string);
  maxlength?:     string | ((param: number) => string);
  range?:         string | ((param: [number, number] | string) => string);
  pattern?:       string;
  equalTo?:       string;
  notEqualTo?:    string;
  numeric?:       string;
  url?:           string;
  date?:          string;
  dateISO?:       string;
  ipv4?:          string;
  ipv6?:          string;
  alpha?:         string;
  alphanumeric?:  string;
  maxfiles?:      string | ((param: number) => string);
  maxsize?:       string | ((param: string) => string);
  maxsizetotal?:  string | ((param: string) => string);
  ishexcolor?:    string;
  time?:          string;
  [key: string]:  string | ((...args: any[]) => string) | undefined;
}
```

> You only need to define keys that differ from the fallback locale. Missing keys resolve to English or the method default.
