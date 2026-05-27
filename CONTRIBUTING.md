# Contributing

## Branching Strategy

- **`develop`** — all contributions and feature work go here
- **`main`** — release branch, always reflects the latest stable version

Create pull requests targeting `develop`. When ready to release, merge `develop` into `main` and run the release script.

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Release Process

Maintainers must prepare release metadata locally on `main` before pushing a release tag. CI no longer mutates release files automatically; it now validates metadata and then handles release automation (GitHub Release creation, asset upload, NPM publish, and GitHub Pages deploy).

### Prerequisites

- NPM publish requires a `NPM_TOKEN` secret configured in the repository settings.

### Prepare release metadata (required)

```bash
# On main branch, after merging develop:
# Bumps package version/package-lock and promotes CHANGELOG.md [Unreleased] notes
npm run release patch   # 1.0.0 → 1.0.1
npm run release minor   # 1.0.0 → 1.1.0
npm run release major   # 1.0.0 → 2.0.0

# Then push commit + tag to trigger the pipeline:
git push origin main --tags
```

### What happens automatically

When a `v*` tag is pushed to `main`, the release pipeline will:

1. **Validate release metadata** from the tagged commit (`package.json` version + `CHANGELOG.md` section must match the tag)
2. **Build** the full bundle (`js-validation.js` + `.min.js` + ESM variants)
3. **Create a GitHub Release** with auto-generated release notes and attach all dist files
4. **Publish to NPM** registry (skips publish if that version already exists)
5. **Deploy** docs and compiled assets to GitHub Pages

After NPM publish, the package is also available via CDN:

```text
https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.min.js
```

### Workflow summary

```text
develop (contributions) → PR → main (releases)
                                  ↓
                            tag v1.x.x
                                  ↓
      CI: metadata validation → build → GitHub Release → NPM publish → Pages deploy
```

### Build output

The release build produces:

| File | Format | Description |
|------|--------|-------------|
| `dist/js-validation.js` | UMD | Unminified, for development |
| `dist/js-validation.min.js` | UMD | Minified, for production |
| `dist/js-validation.esm.js` | ES Module | Unminified, for bundlers |
| `dist/js-validation.esm.min.js` | ES Module | Minified, for bundlers |

## Adding a new built-in rule

1. Create a new file in `src/rules/` (e.g., `src/rules/myRule.js`):

   ```js
   import { VanillaValidator } from '../core.js';

   VanillaValidator.addMethod(
     'myRule',
     (value, param, field, validator) => {
       // Return true if valid, false otherwise
       return value.length > 0;
     },
     'Default error message.'
   );
   ```

2. Import the rule in `src/index.js`:

   ```js
   import './rules/myRule.js';
   ```

3. Add tests in `test/js-validation.test.js`.

4. Run `npm test` to verify, then `npm run build` to confirm the bundle compiles.
