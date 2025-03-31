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
      const { themes = ['light', 'dark'] } = options;

      addBase(base);

      if (themes !== false) {
        const themeObjs = (Array.isArray(themes) ? themes : [themes])
          .map((name) => defaultThemes.find((t) => t.name === name))
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
