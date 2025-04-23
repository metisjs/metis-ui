import path from 'path';
import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  alias: { '@util/*': path.resolve(__dirname, './src/components/_util/*') },
  cjs: {
    input: 'src',
    output: 'lib',
    platform: 'browser',
    transformer: 'babel',
    alias: {
      '@rc-component/util/es': '@rc-component/util/lib',
      'ahooks/es': 'ahooks/lib',
      'rc-field-form/es': 'rc-field-form/lib',
    },
    overrides: {
      'src/components': { output: 'lib' },
      'src/plugin': { output: 'plugin' },
      'src/theme': { output: 'theme' },
    },
    ignores: ['src/components/*/demo/*'],
  },
  esm: {
    input: 'src/components',
    output: 'es',
    platform: 'browser',
    transformer: 'babel',
    alias: {
      '@rc-component/util/lib': '@rc-component/util/es',
      'ahooks/lib': 'ahooks/es',
      'rc-field-form/lib': 'rc-field-form/es',
    },
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
    './plugins/compiled/babel-plugin-transform-use-client',
  ],
  plugins: ['./plugins/father-plugin-generate-locale'],
});
