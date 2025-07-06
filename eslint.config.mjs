import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier, { rules } from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: ['**/build/**', '**/dist/**', 'eslint.config.mjs', '**.next/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  prettier,
  {
    rules: {
      curly: 'error',
    },
  },
]);
