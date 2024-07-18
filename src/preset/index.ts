import containerQueriesPlugin from '@tailwindcss/container-queries';
import typographyPlugin from '@tailwindcss/typography';
import { PREFERS_COLOR_KEY } from './colors/constants';
import plugin from './plugin';

export default {
  darkMode: ['class', `[${PREFERS_COLOR_KEY}="dark"]`],
  plugins: [plugin, typographyPlugin, containerQueriesPlugin],
  safelist: ['metis-btn-compact-item', 'metis-select-compact-item'],
};
