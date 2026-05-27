---
layout: ../layouts/DocsLayout.astro
title: "Changelog"
description: "Version history and release notes for js-validation."
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.2] - 2026-05-27

### Documentation

- docs: demo pages using .astro

## [1.2.1] - 2026-05-27

### Others

- docs: make dynamic version
- docs: make dynamic version
- docs: make dynamic version
- docs: make dynamic version
- docs: make dynamic version

## [1.2.0] - 2026-05-27

### Added

- feat: added rules alphanumeric build-in

### Changed

- refactor: set CI trigger on package.json

### Others

- run npm update
- Update Node.js version badge in README.md
- chore: set minimum Node.js version to v22
- chore: improve release notes body formatting in release-pages.yml

## [1.1.3] - 2026-05-27

### Added

- feat: added new rules ipv4 & ipv6 build-in
- feat: added new rules range build-in
- feat: generate rich release notes body in release-pages.yml

### Changed

- fix: auto-generate changelog from git commits in release script

### Others

- docs: added demo page for rules range

## [1.1.2] - 2026-05-27

### Added

- feat: added date and dateISO built-in validation rules with docs, demos, and coverage by @Copilot in #14

## [1.1.1] - 2026-05-27

### Added

- feat: added url rules by @ddevsr in #11
- docs: migrate to Astro Build by @Copilot in #12

## [1.1.0] - 2026-05-27

### Added

- feat: add invalid attribute, error element, and configurable error class on validation failure by @Copilot in #8

## [1.0.0] - 2026-05-26

### Added

- Initial release of js-validation library.
- Core validator engine (`src/core.js`) with `jsValidation(formOrSelector, options)` API.
- Modular built-in rules (each in `src/rules/`):
  - `required` – validates non-empty fields.
  - `email` – validates email format.
  - `minlength` – validates minimum character length.
  - `maxlength` – validates maximum character length.
  - `pattern` – validates against a regular expression.
  - `equalTo` – validates field matches another field's value.
- Extensibility via `jsValidation.addMethod(name, validateFn, message)`.
- Support for rules from both JavaScript options and `data-rule-*` HTML attributes.
- Custom error messages via `options.messages` and `data-msg-*` attributes.
- Field-level error state with `aria-invalid`, `validationMessage`, and `jsv-invalid` CSS class.
- Form-wide `validate()` and `resetForm()` methods.
- Vite build pipeline producing UMD and ES module bundles (`.js` and `.min.js`).
- Vitest test suite with 18 tests covering all built-in rules.
- CI workflow (GitHub Actions) for building and testing on push/PR.
- Release workflow deploying compiled assets and docs to GitHub Pages.
- Demo page (`docs/index.html`) with declarative and programmatic usage examples.

[Unreleased]: https://github.com/PHPDevsr/js-validation/compare/v1.2.2...HEAD
[1.1.1]: https://github.com/PHPDevsr/js-validation/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/PHPDevsr/js-validation/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/PHPDevsr/js-validation/releases/tag/v1.0.0
[1.1.2]: https://github.com/PHPDevsr/js-validation/compare/v1.1.1...v1.1.2
[1.1.3]: https://github.com/PHPDevsr/js-validation/compare/v1.1.2...v1.1.3
[1.2.0]: https://github.com/PHPDevsr/js-validation/compare/v1.1.3...v1.2.0
[1.2.1]: https://github.com/PHPDevsr/js-validation/compare/v1.2.0...v1.2.1
[1.2.2]: https://github.com/PHPDevsr/js-validation/compare/v1.2.1...v1.2.2
