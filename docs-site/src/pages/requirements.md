---
layout: ../layouts/DocsLayout.astro
title: "Requirements"
description: "System and environment requirements for js-validation."
---

# Requirements

## Runtime Requirements

**js-validation** is a zero-dependency vanilla JavaScript library. It requires no external libraries or frameworks at runtime.

| Requirement | Minimum Version |
|-------------|-----------------|
| JavaScript | ES6+ (ES2015) |
| Browser | Any modern browser (see [Browser Support](/js-validation/browser-support/)) |

## Development Requirements

For building and contributing to the library:

| Tool | Minimum Version | Purpose |
|------|-----------------|---------|
| Node.js | >= 22 | Build and test tooling |
| npm | >= 10 | Package management |

## Development Dependencies

| Package | Purpose |
|---------|---------|
| [Vite](https://vitejs.dev/) | Build tool and bundler |
| [Vitest](https://vitest.dev/) | Unit testing framework |
| [Playwright](https://playwright.dev/) | End-to-end testing |
| [Terser](https://terser.org/) | JavaScript minification |

## Setup for Development

```bash
# Clone the repository
git clone https://github.com/PHPDevsr/js-validation.git
cd js-validation

# Install dependencies
npm install

# Build the library
npm run build

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```
