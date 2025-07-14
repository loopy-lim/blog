import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist", "node_modules"]),
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    parser: "astro-eslint-parser",
    rules: {
      "astro/no-unknown-element": "error",
      "astro/no-unused-vars": "warn",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
