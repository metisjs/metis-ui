import tailwindColors from 'tailwindcss/colors';
import tailwindPlugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';
import base from './base';
import colors from './colors';
import injectThemes from './colors/injectThemes';

const mainFunction = ({ addBase, config }: PluginAPI) => {
  addBase(base);

  injectThemes(addBase, config);
};

export default tailwindPlugin(mainFunction, {
  theme: {
    extend: {
      colors: {
        ...colors,
        // adding all Tailwind `neutral` shades here so they don't get overridden
        'neutral-50': tailwindColors.neutral[50],
        'neutral-100': tailwindColors.neutral[100],
        'neutral-200': tailwindColors.neutral[200],
        'neutral-300': tailwindColors.neutral[300],
        'neutral-400': tailwindColors.neutral[400],
        'neutral-500': tailwindColors.neutral[500],
        'neutral-600': tailwindColors.neutral[600],
        'neutral-700': tailwindColors.neutral[700],
        'neutral-800': tailwindColors.neutral[800],
        'neutral-900': tailwindColors.neutral[900],
        'neutral-950': tailwindColors.neutral[950],
      },
      opacity: {
        disabled: '0.6',
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
      },
    },
  },
});
