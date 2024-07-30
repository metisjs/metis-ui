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
