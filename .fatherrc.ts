import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  alias: { '@util/*': 'src/components/_util/*' },
  cjs: {
    input: 'src',
    output: 'lib',
    platform: 'node',
    transformer: 'esbuild',
    ignores: ['src/components/*/demo/*'],
  },
  esm: {
    input: 'src',
    output: 'es',
    platform: 'browser',
    transformer: 'babel',
    ignores: ['src/components/*/demo/*'],
  },
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
