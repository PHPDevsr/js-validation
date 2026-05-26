# js-validation

Vanilla JavaScript (pure JS) form validation inspired by [`jquery-validation`](https://github.com/jquery-validation/jquery-validation/).

## Features

- No dependency (pure JS)
- Rules from JavaScript options and `data-rule-*` attributes
- Built-in rules: `required`, `email`, `minlength`, `maxlength`, `pattern`, `equalTo`
- Extensible with custom rules via `addMethod`

## Usage

```html
<form id="signup" novalidate>
  <input name="email" data-rule-required="true" data-rule-email="true" />
  <input id="password" name="password" type="password" data-rule-required="true" data-rule-minlength="6" />
  <input name="confirmPassword" type="password" />
  <button type="submit">Save</button>
</form>

<script src="./src/js-validation.js"></script>
<script>
  const validator = jsValidation('#signup', {
    rules: {
      confirmPassword: { equalTo: '#password' }
    },
    messages: {
      confirmPassword: { equalTo: 'Passwords must match.' }
    }
  });
</script>
```

## Custom rule

```js
jsValidation.addMethod('startsWithA', function (value) {
  return value.startsWith('A');
}, 'Must start with letter A.');
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): runs Node tests on push and pull request.
- **CD** (`.github/workflows/release-pages.yml`): on every published release, deploys docs demo to GitHub Pages.
- Demo source: `docs/index.html`
