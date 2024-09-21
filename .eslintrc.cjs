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
        'default-param-last': 'error',
        indent: ['error', 4, { SwitchCase: 1}],
        'vue/no-unused-vars': 'error',
        'vue/multi-word-component-names': 'error',
        'vue/no-async-in-computed-properties': 'error',
        'vue/no-dupe-v-else-if': 'error',
        'vue/no-side-effects-in-computed-properties': 'error',
        'vue/no-unused-components': 'error',
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: [],
        }],
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-empty-function': 0,
        'linebreak-style': 0,
        'max-len': 0,
        'no-param-reassign': ['error', {
            props: true,
            ignorePropertyModificationsFor: [
                'acc', // for reduce accumulators
                'e', // for e.returnvalue
                'req', // for Express requests
                'request', // for Express requests
                'res', // for Express responses
                'response', // for Express responses
                'state', // for Vuex state
                'params', // for ag grid valueSetter,
                'd', // for d3 callbacks with data (d) as arg
            ],
        }],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'import/no-unresolved': [
            'error',
            {
                // eslint-disable-next-line no-useless-escape
                ignore: ['\.svg'],
            },
        ],
        'import/no-webpack-loader-syntax': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/ban-types': [
            'off',
            {
                types: {
                    Function: '',
                },
            },
        ],
        'no-shadow': 0,
        'no-unsafe-optional-chaining': ['warn'],
        'no-use-before-define': ['error', {
            functions: false,
        }],
        'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts'] }],
        'import/prefer-default-export': 'off',
        'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
        'no-continue': 0,
    },
    overrides: [
        {
            files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
            extends: ['plugin:cypress/recommended']
        }
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: [
        'import',
        'vue',
        '@typescript-eslint',
    ],
}
