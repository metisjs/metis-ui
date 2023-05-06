import plugin from './src/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [plugin],
};
