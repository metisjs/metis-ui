import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'es' },
  cjs: { output: 'lib' },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@metisjs/icons',
        libraryDirectory: 'es/icons',
        camel2DashComponentName: false,
      },
      'import-icons',
    ],
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'import-lodash',
    ],
    [
      'import',
      {
        libraryName: 'ahooks',
        libraryDirectory: 'es',
        camel2DashComponentName: false,
      },
      'import-a-hooks',
    ],
  ],
});
