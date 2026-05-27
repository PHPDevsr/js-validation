// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import process from "node:process";
import packageJson from "../package.json" with { type: "json" };

// https://astro.build/config
export default defineConfig({
  site: "https://phpdevsr.github.io",
  base: process.env.ASTRO_BASE || "/js-validation",
  trailingSlash: "always",
  outDir: "../_site",
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
