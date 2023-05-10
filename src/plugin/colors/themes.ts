import colors from 'tailwindcss/colors';

export default {
  '[data-theme=dark]': {
    'color-scheme': 'dark',
    primary: '#661AE6',
    secondary: '#D926AA',
  },
  '[data-theme=light]': {
    'color-scheme': 'light',
    primary: colors.indigo,
    secondary: colors.gray,
  },
} as const;
