import { kebabCase } from 'lodash';
import * as React from 'react';
import { PREFERS_COLOR_KEY } from '../../preset/colors/constants';

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
  'neutralBgContainer',
  'neutralBgElevated',
  'neutralBgLayout',
  'neutralBgMask',
  'neutralBgSpotlight',
  'neutralBorder',
  'neutralBorderSecondary',
  'neutralFill',
  'neutralFillQuaternary',
  'neutralFillSecondary',
  'neutralFillTertiary',
  'neutralText',
  'neutralTextQuaternary',
  'neutralTextSecondary',
  'neutralTextTertiary',
];

type Theme = {
  [key in (typeof THEME_KEYS)[number]]: string;
};

const genTheme = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  return THEME_KEYS.reduce((prev, curr) => {
    const value = rootStyles.getPropertyValue(`--${kebabCase(curr)}`).trim();
    return {
      ...prev,
      [curr]: `hsla(${value.replace(/ \/ | /g, ',')})`,
    };
  }, {} as Theme);
};

export default function useTheme(): Theme {
  const [theme, setTheme] = React.useState(genTheme);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(genTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [PREFERS_COLOR_KEY],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}
