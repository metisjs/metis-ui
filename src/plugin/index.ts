import tailwindPlugin from 'tailwindcss/plugin';
import base from './base';
import config from './config';
import type { ThemeOptions } from './theme';
import defaultThemes from './theme/themes';
import { applyThemes } from './theme/util';

export type Options = {
  themes?: false | string[];
};

export default tailwindPlugin.withOptions<Options>(
  (options = {}) =>
    ({ addBase }) => {
      const { themes = ['light --default', 'dark --dark'] } = options;

      addBase(base);

      if (themes !== false) {
        const themeObjs = (Array.isArray(themes) ? themes : [themes])
          .map((item) => {
            const [name, ...rest] = item.split(' ');
            const theme = defaultThemes.find((t) => t.name === name);

            if (!theme) return null;

            return { ...theme, default: rest.includes('--default'), dark: rest.includes('--dark') };
          })
          .filter(Boolean) as ThemeOptions[];

        if (themeObjs.length === 1) {
          applyThemes([{ ...themeObjs[0], default: true }], addBase);
        } else {
          applyThemes(themeObjs, addBase);
        }
      }
    },
  () => config,
);
