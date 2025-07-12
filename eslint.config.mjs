import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import sortExports from 'eslint-plugin-sort-exports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  {
    // config with just ignores is the replacement for `.eslintignore`
    ignores: ['**/build/**', '**/dist/**', 'eslint.config.mjs', '**.next/**', 'postcss.config.mjs'],
  },
  {
    files: ['**/*.{ts,tsx}'],
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  ...compat.extends('next/typescript'),
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.recommended,
  jsxA11y.flatConfigs.strict,
  // needs to be at the bottom to override any other rules
  prettierConfig,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      'react': reactPlugin,
      'import': importPlugin,
      'sort-exports': sortExports,
    },
  },
  {
    settings: {
      'react': {
        version: 'detect',
      },
      'import/resolver': { typescript: { alwaysTryTypes: true } },
    },
  },
  {
    rules: {
      'import/no-unresolved': [
        'error',
        {
          commonjs: true,
          amd: true,
        },
      ],
      'import/no-namespace': ['error', { ignore: ['*.ext'] }],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          'groups': [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index', 'type'], ['object']],
          'newlines-between': 'always',
          'pathGroups': [
            {
              pattern: '{react,react-dom/**,redux}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '*.{scss,css}',
              group: 'object',
              patternOptions: { matchBase: true },
              position: 'after',
            },
          ],
          'warnOnUnassignedImports': true,
          'pathGroupsExcludedImportTypes': ['react', 'react-dom/**'],
          'distinctGroup': false,
          'alphabetize': {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['all', 'multiple', 'single', 'none'],
          allowSeparatedGroups: false,
        },
      ],
      'sort-exports/sort-exports': [
        'error',
        {
          sortDir: 'asc',
          ignoreCase: false,
          sortExportKindFirst: 'type',
          pattern: '**/index.*',
        },
      ],
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      'jsx-a11y/control-has-associated-label': 2,
      'jsx-a11y/label-has-for': [
        'error',
        {
          required: {
            some: ['nesting', 'id'],
          },
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  }
);
