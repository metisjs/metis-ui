import path from 'path';
import { defineConfig } from 'dumi';
import rehypePlugin from './.dumi/rehypePlugin';
import remarkPlugin from './.dumi/remarkPlugin';

export default defineConfig({
  mfsu: true,
  hash: true,
  outputPath: '_site',
  favicons: ['/favicon.ico'],
  resolve: {
    docDirs: [{ type: 'doc', dir: 'docs' }],
    atomDirs: [{ type: 'component', dir: 'src/components' }],
    codeBlockMode: 'passive',
  },
  locales: [
    { id: 'en-US', name: 'English', suffix: '' },
    { id: 'zh-CN', name: '中文', suffix: '-cn' },
  ],
  alias: {
    'metis-ui/lib': path.join(__dirname, 'src/components'),
    'metis-ui/es': path.join(__dirname, 'src/components'),
    'metis-ui': path.join(__dirname, 'src/components'),
    '@util': path.join(__dirname, 'src/components/_util'),
  },
  theme: { '@c-primary': '#4f46e5', '@c-primary-dark': '#6366f1' },
  analytics: {
    ga_v2: 'G-8FBZW4BJD2',
  },
  tailwindcss: {},
  plugins: ['./plugins/compiled/dumi-plugin-tailwindcss'],
  extraRehypePlugins: [rehypePlugin],
  extraRemarkPlugins: [remarkPlugin],
  headScripts: [
    `
    (function () {
      function isLocalStorageNameSupported() {
        const testKey = 'test';
        const storage = window.localStorage;
        try {
          storage.setItem(testKey, '1');
          storage.removeItem(testKey);
          return true;
        } catch (error) {
          return false;
        }
      }
      // 优先级提高到所有静态资源的前面，语言不对，加载其他静态资源没意义
      const pathname = location.pathname;

      function isZhCN(pathname) {
        return /-cn\\/?$/.test(pathname);
      }
      function getLocalizedPathname(path, zhCN) {
        const pathname = path.indexOf('/') === 0 ? path : '/' + path;
        if (!zhCN) {
          // to enUS
          return /\\/?index(-cn)?/.test(pathname) ? '/' : pathname.replace('-cn', '');
        } else if (pathname === '/') {
          return '/index-cn';
        } else if (pathname.indexOf('/') === pathname.length - 1) {
          return pathname.replace(/\\/$/, '-cn/');
        }
        return pathname + '-cn';
      }

      if (isLocalStorageNameSupported() && (pathname === '/' || pathname === '/index-cn')) {
        const lang =
          (window.localStorage && localStorage.getItem('locale')) ||
          ((navigator.language || navigator.browserLanguage).toLowerCase() === 'zh-cn'
            ? 'zh-CN'
            : 'en-US');
        // safari is 'zh-cn', while other browser is 'zh-CN';
        if ((lang === 'zh-CN') !== isZhCN(pathname)) {
          location.pathname = getLocalizedPathname(pathname, lang === 'zh-CN');
        }
      }
      document.documentElement.className += isZhCN(pathname) ? 'zh-cn' : 'en-us';
    })();
    `,
  ],
  targets: { chrome: 111 },
  extraPostCSSPlugins: ['postcss-nested'],
});
