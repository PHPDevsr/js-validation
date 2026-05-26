# js-validation

Vanilla JavaScript (pure JS) form validation inspired by [`jquery-validation`](https://github.com/jquery-validation/jquery-validation/).

## Features

- No dependency (pure JS)
- Modular rules – each rule lives in its own file under `src/rules/`
- Built-in rules: `required`, `email`, `minlength`, `maxlength`, `pattern`, `equalTo`
- Extensible with custom rules via `addMethod`
- Build with **Vite** – outputs `js-validation.js` and `js-validation.min.js`
- Test with **Vitest**

## Installation

```bash
npm install
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

```js
import jsValidation from 'js-validation';

const validator = jsValidation('#signup', {
  rules: {
    email: { required: true, email: true },
    confirmPassword: { equalTo: '#password' }
  },
  messages: {
    confirmPassword: { equalTo: 'Passwords must match.' }
  }
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
  index.js         – Entry point (imports core + all rules)
  rules/
    required.js
    email.js
    minlength.js
    maxlength.js
    pattern.js
    equalTo.js
test/
  js-validation.test.js
docs/
  index.html       – Demo page (deployed to GitHub Pages)
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): builds with Vite and runs Vitest on push/PR.
- **CD** (`.github/workflows/release-pages.yml`): on every published release, builds the bundle and deploys the demo + compiled assets to GitHub Pages.

