const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'reports/**',
      'allure-results/**',
      'allure-report/**',
      'screenshots/**',
      'test-results/**',
      'playwright-report/**',
      'eslint.config.js',
    ],
  },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      // Step definitions/hooks intentionally use `function (this: CustomWorld)`
      // (not arrow functions) so Cucumber can bind its own `this` -- that
      // pattern reads as an unused expression to some rules, so keep this off.
      '@typescript-eslint/no-unused-expressions': 'off',
      // Page objects/config occasionally need a quick escape hatch; warn
      // instead of hard-erroring so it doesn't block CI outright.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);
