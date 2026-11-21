// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'public/*', 'tools/*', 'src/api/generated/*', 'scripts/reset-project.js'],
  },
  {
    // Findings in the prototype screens that predate this config. They stay
    // visible as warnings until each screen is reworked; new code is held to
    // the full rule set. react/no-unescaped-entities is an HTML-escaping rule
    // and does not apply to React Native <Text>.
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      globals: { jest: 'readonly', describe: 'readonly', it: 'readonly', expect: 'readonly', beforeEach: 'readonly', afterEach: 'readonly' },
    },
  },
]);
