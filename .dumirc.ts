import path from 'path';
import { defineConfig } from 'dumi';

export default defineConfig({
  mfsu: false,
  hash: true,
  outputPath: '_site',
  favicons: ['/favicon.ico'],
  resolve: {
    atomDirs: [{ type: 'component', dir: 'src/components' }],
    codeBlockMode: 'passive',
  },
  locales: [
    { id: 'en-US', name: 'English', suffix: '' },
    { id: 'zh-CN', name: '中文', suffix: '-cn' },
  ],
  themeConfig: {
    logo: '/logo.svg',
    name: 'Metis UI',
    prefersColor: { default: 'auto' },
    socialLinks: {
      github: 'https://github.com/metisjs/metis-ui',
    },
  },
  theme: { '@c-primary': '#4f46e5', '@c-primary-dark': '#6366f1' },
  alias: {
    'metis-ui/lib': path.join(__dirname, 'src/components'),
    'metis-ui/es': path.join(__dirname, 'src/components'),
    'metis-ui': path.join(__dirname, 'src/components'),
    '@util': path.join(__dirname, 'src/components/_util'),
  },
  tailwindcss: {},
  plugins: ['@umijs/plugins/dist/tailwindcss'],
});
