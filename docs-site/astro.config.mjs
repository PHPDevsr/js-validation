// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import process from "node:process";
import packageJson from "../package.json" with { type: "json" };

process.env.PUBLIC_APP_VERSION = packageJson.version;

// https://astro.build/config
export default defineConfig({
  site: "https://phpdevsr.github.io",
  base: process.env.ASTRO_BASE || "/js-validation",
  trailingSlash: "always",
  outDir: "../_site",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
