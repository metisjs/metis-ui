import tailwindPlugin from 'tailwindcss/plugin';

// import defaultThemes from './themes';

export type ThemeOptions = {
  name?: string;
  default?: boolean;
  dark?: boolean;
  'color-scheme'?: string;
  [key: string]: any;
};

export default tailwindPlugin.withOptions<ThemeOptions>((options = {}) => ({ addBase }) => {
  // const {
  //   name = 'custom-theme',
  //   default: isDefault = false,
  //   dark = false,
  //   'color-scheme': colorScheme = 'normal',
  //   ...colors
  // } = options;
  // const exist = !!defaultThemes[name];
});
