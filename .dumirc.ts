import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  hash: true,
  outputPath: '_site',
  resolve: {
    docDirs: [{ type: 'doc', dir: 'docs' }],
    atomDirs: [{ type: 'component', dir: 'src/components' }],
    entryFile: './src/components/index.ts',
  },
  alias: {
    '@meta/ui/lib': path.join(__dirname, 'src/components'),
    '@meta/ui/es': path.join(__dirname, 'src/components'),
    '@meta/ui': path.join(__dirname, 'src/components'),
  },
  tailwindcss: {},
  plugins: ['@umijs/plugins/dist/tailwindcss'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@icon-park/react',
        libraryDirectory: 'es/icons',
        camel2DashComponentName: false,
      },
    ],
  ],
});
