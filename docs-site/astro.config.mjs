// @ts-check
import { defineConfig } from 'astro/config';
import starlight from "@astrojs/starlight";
import process from "node:process";

// https://astro.build/config
export default defineConfig({
  site: "https://phpdevsr.github.io",
  base: process.env.ASTRO_BASE || "/js-validation",
  integrations: [
    starlight({
      title: "@phpdevsr/js-validation - A JavaScript validation library for Node.js and browsers.",
    }),
  ],
  trailingSlash: "always",
  outDir: "../_site",
});
