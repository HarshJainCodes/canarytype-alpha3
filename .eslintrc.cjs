/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'vue/no-unused-vars': 'error',
    'vue/multi-word-component-names': 'error',
    'vue/no-async-in-computed-properties': 'error',
    'vue/no-dupe-v-else-if': 'error',
    'vue/no-side-effects-in-computed-properties': 'error',
    'vue/no-unused-components': 'error'
  },
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended']
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser'
  }
}
