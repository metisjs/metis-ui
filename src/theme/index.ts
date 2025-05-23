import { merge } from '@rc-component/util/es/utils/set';
import tailwindPlugin from 'tailwindcss/plugin';
import defaultThemes from './themes';
import { applyThemes, genThemeVariables } from './util';

export type ThemeOptions = {
  name?: string;
  default?: boolean;
  dark?: boolean;
  'color-scheme'?: string;
  [key: string]: any;
};

module.exports = tailwindPlugin.withOptions<ThemeOptions>((options = {}) => ({ addBase }) => {
  const { name = 'custom-theme' } = options;

  const existTheme = defaultThemes.find((theme) => theme.name === name);

  let theme: ThemeOptions | undefined = undefined;
  if (!!existTheme) {
    theme = merge(existTheme, genThemeVariables(options));
  } else {
    theme = genThemeVariables(options);
  }

  applyThemes([theme], addBase);
});
