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
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
    },
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
        disabled: '0.3',
      },
      // transitionProperty: {},
      keyframes: {
        'bounce-spin': {
          '0%, 100%': {
            transform: 'scaleY(0.4)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'scaleY(1)',
            opacity: '1',
          },
        },
        'progress-active': {
          '0%': {
            transform: `translateX(-100%) scaleX(0)`,
            opacity: '0.1',
          },
          '20%': {
            transform: `translateX(-100%) scaleX(0)`,
            opacity: '0.5',
          },
          to: {
            transform: 'translateX(0) scaleX(1)',
            opacity: '0',
          },
        },
      },
    },
  },
});
