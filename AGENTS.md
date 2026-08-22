# AGENTS.md

Guide for AI coding agents (Claude Code and others) working in this repository. This is the source of truth — `CLAUDE.md` points here.

## Project

`@phpdevsr/js-validation` — lightweight, zero-dependency vanilla JavaScript form validation library inspired by `jquery-validation`. Ships as UMD + ES module, no runtime deps, Node >= 22.

## Commands

```bash
npm ci                 # install (lockfile-respecting)
npm run build          # vite build (UMD + ESM, unminified) then minified build
npm test               # vitest run — unit tests
npm run test:watch     # vitest watch
npm run test:e2e       # playwright (chromium + firefox + webkit), auto-serves on :5174
npm run release        # maintainer-only: bumps version + changelog (.github/scripts/release.sh)
```

CI uses Node 24 (`.github/workflows/ci.yml`), `.nvmrc` says 22, `package.json` engines says `>=22`. Use 22+ locally.

## Repo layout

- `src/core.js` — `VanillaValidator` class. The whole engine: rule registration (`addMethod`), locale messages (`addLocaleMessages`), rule resolution from `options.rules` + `data-rule-*` dataset, per-field `element()` validation, `validate()`, `showError`/`clearError`, submit + input event binding.
- `src/index.js` — full bundle entry: imports core, all rules, registers all locales, exports `jsValidation` default + `VanillaValidator` named.
- `src/core-entry.js` — core-only entry (no rules, no locales). For selective imports via `js-validation/core` + `js-validation/rules/*`.
- `src/rules/*.js` — one file per built-in rule. Each calls `VanillaValidator.addMethod(name, validateFn, message)`.
- `src/locales.js` — aggregates locale files from `src/locales/<lang>.js` (currently `en`, `es`).
- `test/js-validation.test.js` — vitest unit tests (jsdom-free; hand-rolled fake field/form objects).
- `test/selective-import.test.js` — verifies core-only entry works.
- `test/e2e/<rule>/` — Playwright fixture (`fixture.html`) + spec per rule; `test/e2e/validation.spec.js` is the general one.
- `vite.config.js` (unminified), `vite.config.min.js` (terser-minified), `vite.config.e2e.js` (dev server for e2e, root `test/e2e`, aliases `/src` → `src`).
- `docs-site/` — separate Astro docs site (own `package.json`).
- `dist/` — build output, gitignored.

## Architecture & conventions

**Rule registration is global/static.** `VanillaValidator.methods` and `.locales` are static class properties. Rules register themselves as a side effect of import — `src/rules/email.js` just calls `addMethod` at module top level. Importing a rule file = registering that rule. This is why `core-entry.js` + selective rule imports work, and why test file load order matters (a rule imported by one test file is registered globally for all).

**Adding a built-in rule** (see CONTRIBUTING.md):
1. Create `src/rules/myRule.js` — `import { VanillaValidator } from '../core.js'` then `addMethod(name, (value, param, field, validator) => bool, message)`. Message can be a string or `(param, field) => string`.
2. Import it in `src/index.js` (`import './rules/myRule.js'`).
3. Add a locale entry in each `src/locales/<lang>.js`.
4. Add tests in `test/js-validation.test.js` and an e2e fixture/spec in `test/e2e/`.

**Adding a locale:** create `src/locales/<lang>.js` exporting a `{ ruleName: message }` object, then re-export it from `src/locales.js`.

**Rule resolution per field** (`_rulesFor`): merges `data-rule-*` dataset attributes with `options.rules[fieldName]`. Dataset keys like `dataRuleEmail` → rule name `email` (first char after `rule` lowercased). A `data-rule-*` with empty value means `true`; `false`/`'false'` param skips the rule. `range` params are JSON-parsed arrays.

**Message resolution** (`_messageFor`): `options.messages[field][rule]` → locale messages for `this.lang` (default `en`) → English fallback → rule's default message. Functions receive `(param, field)`.

**Validation runs synchronously** in `element()`: iterates rules in insertion order, fails on first invalid rule, shows error, returns false. `validate()` runs `element()` over all non-disabled, named, non-submit fields.

**Error display** toggles an `is-invalid` class on the field and inserts an error element (`<span class="invalid-feedback">`, configurable via options) after the field, keyed by `data-jsv-error-for="<name>"`. The unit tests use fake DOM objects with a manual `classList` Set, so no jsdom is needed.

## Coding conventions

- ESM throughout (`"type": "module"`). No build step for source — Vite only bundles `src/index.js` for dist.
- Vanilla JS, no TypeScript, no transpilation. Keep source readable as-is.
- Zero runtime dependencies — do not add any. Dev deps only (vite, vitest, playwright, terser).
- Match existing rule file style: single `addMethod` call, message as string or `(param) =>` fn.
- Prototype-pollution hardening: `addMethod`/`addLocaleMessages` reject `__proto__`/`constructor`/`prototype` keys. Preserve this guard when touching registration code.

## Git & PRs

- Branching: `develop` is the working branch (PRs target it); `main` is release-only. Current default for PRs is `develop`.
- PR titles must follow Conventional Commits: `feat|fix|chore|docs|perf|refactor|style|test|config|revert(scope)?!: summary` (enforced by `.github/prlint.json`).
- Dependabot keeps GitHub Actions and dev deps bumped — expect frequent `chore(deps)` commits.
- Don't commit `dist/`; it's built in CI and gitignored.
