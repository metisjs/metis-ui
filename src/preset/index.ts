import containerQueriesPlugin from '@tailwindcss/container-queries';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import { PREFERS_COLOR_KEY } from './colors/constants';
import plugin from './plugin';

export default {
  darkMode: ['class', `[${PREFERS_COLOR_KEY}="dark"]`],
  plugins: [plugin, formsPlugin, typographyPlugin, containerQueriesPlugin],
  safelist: [
    'metis-btn-compact-item',
    'metis-input-prefix',
    'metis-input-suffix',
    'metis-select-compact-item',
  ],
};
