---
layout: ../layouts/DocsLayout.astro
title: "Browser Support"
description: "Supported browsers and compatibility notes for js-validation."
---

# Browser Support

## Supported Browsers

**js-validation** is written in vanilla ES6+ JavaScript and works in all modern browsers without polyfills.

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 60+ | ✅ Supported |
| Firefox | 55+ | ✅ Supported |
| Safari | 12+ | ✅ Supported |
| Edge | 79+ (Chromium) | ✅ Supported |
| Opera | 47+ | ✅ Supported |
| Chrome Android | 60+ | ✅ Supported |
| Safari iOS | 12+ | ✅ Supported |

## Not Supported

| Browser | Notes |
|---------|-------|
| Internet Explorer | Not supported (no ES6 support) |
| Edge Legacy (EdgeHTML) | Not supported |

## Required Browser Features

The library relies on the following standard browser APIs:

- `document.querySelector` / `querySelectorAll`
- `addEventListener`
- `classList`
- `dataset` (for `data-rule-*` and `data-msg-*` attributes)
- `Set` and `Array.from`
- Arrow functions and template literals (ES6)

All of these are natively available in the supported browsers listed above.

## Testing

The library is tested across multiple browser engines using [Playwright](https://playwright.dev/):

- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

## Using with Older Browsers

If you need to support older browsers, you can transpile the ES module source using tools like [Babel](https://babeljs.io/) and add appropriate polyfills. However, this is not officially supported.
