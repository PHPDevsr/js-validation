# Contributing

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

This project uses GitHub Releases to trigger the deployment pipeline.

### Steps to create a release

1. **Update version** in `package.json`:
   ```bash
   npm version patch   # for bug fixes (1.0.0 → 1.0.1)
   npm version minor   # for new features (1.0.0 → 1.1.0)
   npm version major   # for breaking changes (1.0.0 → 2.0.0)
   ```

2. **Update `CHANGELOG.md`** with the new version's changes under a new heading:
   ```markdown
   ## [1.1.0] - YYYY-MM-DD

   ### Added
   - Description of new features

   ### Changed
   - Description of changes

   ### Fixed
   - Description of bug fixes
   ```

3. **Commit and push** the version bump and changelog update:
   ```bash
   git add package.json package-lock.json CHANGELOG.md
   git commit -m "chore: release vX.Y.Z"
   git push origin main
   ```

4. **Create a GitHub Release**:
   - Go to the repository's [Releases page](../../releases/new)
   - Click **"Draft a new release"**
   - Create a new tag matching the version (e.g., `v1.1.0`)
   - Set the release title (e.g., `v1.1.0`)
   - Copy the relevant section from `CHANGELOG.md` into the release description
   - Click **"Publish release"**

5. **Automated deployment**: Once the release is published, the `release-pages.yml` workflow will:
   - Install dependencies
   - Build the full bundle (`js-validation.js` + `js-validation.min.js`)
   - Deploy docs and compiled assets to GitHub Pages

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
