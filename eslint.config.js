import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "reports/**",
      "test-results/**",
      "blob-report/**",
      "playwright-report/**",
      "allure-results/**",
      "allure-report/**",
      ".auth/**",
      "dist/**",
      "*.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },
  {
    files: ["tests/**/*.spec.ts", "tests/**/*.test.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-skipped-test": "warn",
      "playwright/no-conditional-in-test": "warn",
      "playwright/expect-expect": "off",
    },
  },
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  }
);
