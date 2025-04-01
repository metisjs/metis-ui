import * as React from 'react';
import { kebabCase } from 'lodash';
import { ConfigContext } from '../config-provider';

const THEME_KEYS = [
  'primary',
  'primaryActive',
  'primaryBg',
  'primaryBgHover',
  'primaryHover',
  'primaryBorder',
  'primaryBorderSecondary',
  'error',
  'errorActive',
  'errorBg',
  'errorBgHover',
  'errorHover',
  'errorBorder',
  'errorBorderSecondary',
  'info',
  'infoActive',
  'infoBg',
  'infoBgHover',
  'infoHover',
  'infoBorder',
  'infoBorderSecondary',
  'success',
  'successActive',
  'successBg',
  'successBgHover',
  'successHover',
  'successBorder',
  'successBorderSecondary',
  'warning',
  'warningActive',
  'warningBg',
  'warningBgHover',
  'warningHover',
  'warningBorder',
  'warningBorderSecondary',
  'container',
  'elevated',
  'layout',
  'mask',
  'spotlight',
  'border',
  'borderSecondary',
  'fill',
  'fillQuaternary',
  'fillSecondary',
  'fillTertiary',
  'text',
  'textQuaternary',
  'textSecondary',
  'textTertiary',
] as const;

type Theme = {
  [key in (typeof THEME_KEYS)[number]]: string;
} & { isDark: boolean };

const genTheme = (target?: HTMLDivElement | null) => {
  const rootStyles = getComputedStyle(target ?? document.documentElement);
  const colorScheme = rootStyles.getPropertyValue('color-scheme').trim();

  return THEME_KEYS.reduce(
    (prev, curr) => {
      const value = rootStyles.getPropertyValue(`--${kebabCase(curr)}`).trim();
      return {
        ...prev,
        [curr]: value,
      };
    },
    { isDark: colorScheme === 'dark' } as Theme,
  );
};

export default function useTheme(): Theme {
  const { theme, themeTarget } = React.useContext(ConfigContext);
  const [themeVariables, setThemeVariables] = React.useState(() => genTheme(themeTarget?.current));

  React.useEffect(() => {
    setThemeVariables(genTheme(themeTarget?.current));

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setThemeVariables(genTheme(themeTarget?.current));
    };

    if (theme === 'auto') {
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return themeVariables;
}
