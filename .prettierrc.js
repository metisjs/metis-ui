module.exports = {
  pluginSearchDirs: false,
  plugins: [
    'prettier-plugin-organize-imports',
    'prettier-plugin-packagejson',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: ['^(react|react-dom)$', '^([a-z]|@[a-z])', '.*'],
  tailwindFunctions: ['clsx'],
  printWidth: 100,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  jsxSingleQuote: false,
};
