import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // ✅ Converts legacy "extends"
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Flat Config block with parser and rules
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
