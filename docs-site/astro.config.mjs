// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://phpdevsr.github.io',
  base: '/js-validation',
  trailingSlash: 'always',
  outDir: '../_site',
});
