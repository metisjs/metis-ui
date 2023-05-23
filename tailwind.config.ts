import type { Config } from 'tailwindcss';
import plugin from './src/plugin';

export default {
  darkMode: ['class', '[data-prefers-color="dark"]'],
  content: ['./src/components/**/*.{ts,tsx,js,jsx}', './.dumi/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [plugin],
} satisfies Config;
