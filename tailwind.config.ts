import type { Config } from 'tailwindcss';
import plugin from './src/plugin';

export default {
  content: ['./src/components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [plugin],
  metaui: { themeWithSystem: true },
} satisfies Config;
