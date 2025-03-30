module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
        '@typescript-eslint/no-unused-expressions': 2,
        '@typescript-eslint/consistent-type-imports': [2, { disallowTypeAnnotations: false }],
      },
    },
  ],
  ignorePatterns: ['plugins/compiled/*'],
};
