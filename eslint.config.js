const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

module.exports = tseslint.config(
  {
    ignores: [
      'dist/',
      'docs/',
      'coverage/',
      'node_modules/',
      'benchmarks/',
      'examples/',
      'android/',
      'ios/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {...globals.node},
    },
    rules: {
      // Bitwise operators are a common typo for logical ones; files that
      // need them opt out explicitly
      'no-bitwise': 'error',
      'dot-notation': 'error',
      'no-array-constructor': 'error',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['src/**/__tests__/**'],
    languageOptions: {
      globals: {...globals.jest},
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
