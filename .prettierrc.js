module.exports = {
  pluginSearchDirs: false,
  plugins: [
    require('prettier-plugin-organize-imports'),
    require('prettier-plugin-packagejson'),
    require('prettier-plugin-tailwindcss'),
  ],
  tailwindFunctions: ['cva', 'classNames', 'classnames', 'clsx'],
  printWidth: 100,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
};
