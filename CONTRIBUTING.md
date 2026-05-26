# Contributing

## Documentation

Project documentation lives in the `docs/` folder as Markdown (`.md`) files. These are published to GitHub Pages on every release.

### Documentation Structure

| File | Content |
|------|---------|
| `docs/README.md` | Index / landing page with table of contents |
| `docs/getting-started.md` | Quick-start guide and API reference |
| `docs/installation.md` | Installation methods (NPM, CDN, download) |
| `docs/requirements.md` | Runtime and development requirements |
| `docs/browser-support.md` | Supported browsers and required APIs |
| `docs/rules.md` | Complete list of built-in validation rules |
| `docs/custom-rules.md` | Guide for creating custom validation rules |
| `docs/changelog.md` | Version history and release notes |

### Writing Documentation

When contributing documentation:

1. **Use Markdown format** — all docs files must be `.md` files in the `docs/` folder.
2. **Follow existing structure** — use headings, tables, and code blocks consistently.
3. **Include code examples** — show both usage with options and HTML `data-rule-*` attributes.
4. **Link between pages** — use relative links (e.g., `[Rules List](rules.md)`).
5. **Keep the index updated** — add new pages to `docs/README.md` table of contents.

### Publishing Documentation

Documentation is published automatically to GitHub Pages when a release tag (`v*`) is pushed to `main`. The release pipeline deploys the `docs/` folder contents along with compiled assets.

To preview documentation locally, you can use any Markdown previewer or serve the `docs/` folder with a local HTTP server.

---

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

Maintainers create a release by simply tagging a version on `main`. The CI pipeline handles everything else automatically (GitHub Release creation, asset upload, NPM publish, and GitHub Pages deploy).

### Prerequisites

- NPM publish requires a `NPM_TOKEN` secret configured in the repository settings.

### Quick release (one command)

```bash
# On main branch, after merging develop:
npm run release patch   # 1.0.0 → 1.0.1
npm run release minor   # 1.0.0 → 1.1.0
npm run release major   # 1.0.0 → 2.0.0

# Then push to trigger the pipeline:
git push origin main --tags
```

### Manual tag release

```bash
# On main branch:
git tag v1.1.0
git push origin main --tags
```

### What happens automatically

When a `v*` tag is pushed to `main`, the release pipeline will:

1. **Build** the full bundle (`js-validation.js` + `.min.js` + ESM variants)
2. **Create a GitHub Release** with auto-generated release notes and attach all dist files
3. **Publish to NPM** registry (available via `npm install @phpdevsr/js-validation`)
4. **Deploy** docs and compiled assets to GitHub Pages

After NPM publish, the package is also available via CDN:
```
https://cdn.jsdelivr.net/npm/@phpdevsr/js-validation/dist/js-validation.min.js
```

### Workflow summary

```
develop (contributions) → PR → main (releases)
                                  ↓
                            tag v1.x.x
                                  ↓
                     CI: build → GitHub Release → NPM publish → Pages deploy
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
