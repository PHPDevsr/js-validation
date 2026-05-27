// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/.astro/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/_site/**",
    ],
  },

  js.configs.recommended,
  ...astro.configs.recommended,

  {
    languageOptions: {
      globals: {
        __APP_VERSION__: "readonly",

        window: "readonly",
        document: "readonly",
        console: "readonly",

        jsValidation: "readonly",
      },
    },
  },
];
