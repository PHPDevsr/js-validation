// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/', '../_site/'],
  },
];
