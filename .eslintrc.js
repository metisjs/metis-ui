module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  plugins: ['lodash'],
  rules: {
    'lodash/import-scope': 2,
  },
};
