module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    overrides: [
        {
            files: ['*.ts'],
            rules: { '@typescript-eslint/no-explicit-any': 'off' },
        },
    ],
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['*.cjs'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
    },
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
};
