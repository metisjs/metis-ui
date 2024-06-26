module.exports = {
  pluginSearchDirs: false,
  plugins: [
    require('prettier-plugin-organize-imports'),
    require('prettier-plugin-packagejson'),
    require('prettier-plugin-tailwindcss'),
  ],
  tailwindFunctions: ['cva', 'classNames', 'classnames', 'clsx'],
  importOrder: ['^(react|react-dom)$', '^([a-z]|@[a-z])', '', '.*'],
  printWidth: 100,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  jsxSingleQuote: false,
};
