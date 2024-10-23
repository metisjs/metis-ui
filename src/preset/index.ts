import containerQueriesPlugin from '@tailwindcss/container-queries';
import typographyPlugin from '@tailwindcss/typography';
import transform3DPlugin from 'tailwindcss-3d';
import { PREFERS_COLOR_KEY } from './colors/constants';
import plugin from './plugin';

export default {
  darkMode: ['class', `[${PREFERS_COLOR_KEY}="dark"]`],
  plugins: [plugin, typographyPlugin, containerQueriesPlugin, transform3DPlugin],
  safelist: ['metis-btn-compact-item'],
};
