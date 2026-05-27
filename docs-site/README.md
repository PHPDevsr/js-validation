# Documentation

Project documentation lives in `docs-site/src/pages/` as Markdown (`.md`) and Astro (`.astro`) pages. These are published to GitHub Pages on every release.

## Documentation Structure

| File | Content |
|------|---------|
| `src/pages/index.astro` | Index / landing page |
| `src/pages/getting-started.md` | Quick-start guide and API reference |
| `src/pages/installation.md` | Installation methods (NPM, CDN, download) |
| `src/pages/requirements.md` | Runtime and development requirements |
| `src/pages/browser-support.md` | Supported browsers and required APIs |
| `src/pages/rules.md` | Complete list of built-in validation rules |
| `src/pages/custom-rules.md` | Guide for creating custom validation rules |
| `src/pages/changelog.md` | Version history and release notes |

## Writing Documentation

When contributing documentation:

1. **Use Markdown/Astro format** — docs pages should be `.md` or `.astro` files in `src/pages/`.
2. **Follow existing structure** — use headings, tables, and code blocks consistently.
3. **Include code examples** — show both usage with options and HTML `data-rule-*` attributes.
4. **Link between pages** — use relative links where possible.
5. **Keep navigation in sync** — update `src/layouts/DocsLayout.astro` when adding new pages.

## Publishing Documentation

Documentation is published automatically to GitHub Pages when a release tag (`v*`) is pushed to `main`. The release pipeline deploys the docs site along with compiled assets.

To preview docs locally:

```bash
npm ci
npm run build
```
