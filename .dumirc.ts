import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  mfsu: false,
  hash: true,
  outputPath: '_site',
  favicons: ['/favicon.ico'],
  themeConfig: {
    logo: '/logo.svg',
    name: 'Metis UI',
    prefersColor: { default: 'auto' },
    socialLinks: {
      github: 'https://github.com/meta-oa/meta-ui',
    },
  },
  theme: { '@c-primary': '#4f46e5', '@c-primary-dark': '#6366f1' },
  resolve: {
    atomDirs: [{ type: 'component', dir: 'src/components' }],
    codeBlockMode: 'passive',
  },
  alias: {
    'meta-ui/lib': path.join(__dirname, 'src/components'),
    'meta-ui/es': path.join(__dirname, 'src/components'),
    'meta-ui': path.join(__dirname, 'src/components'),
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
