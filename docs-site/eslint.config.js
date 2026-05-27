// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: {
        __APP_VERSION__: "readonly",
      },
    },
    ignores: ["node_modules/", "dist/", "../_site/", ".astro/"],
  },
];
