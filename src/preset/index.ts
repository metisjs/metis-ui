import containerQueriesPlugin from '@tailwindcss/container-queries';
import typographyPlugin from '@tailwindcss/typography';
import { PREFERS_COLOR_KEY } from './colors/constants';
import basePlugin from './plugins/basePlugin';
import translate3DPlugin from './plugins/translate3DPlugin';

export default {
  darkMode: ['class', `[${PREFERS_COLOR_KEY}="dark"]`],
  plugins: [basePlugin, translate3DPlugin, typographyPlugin, containerQueriesPlugin],
  safelist: ['metis-btn-compact-item'],
};
