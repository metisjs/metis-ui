import * as React from 'react';
import { kebabCase } from 'lodash';
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
  'container',
  'elevated',
  'layout',
  'bgMask',
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
];

type Theme = {
  primary: string;
  primaryActive: string;
  primaryBg: string;
  primaryBgHover: string;
  primaryHover: string;
  primaryBorder: string;
  primaryBorderSecondary: string;
  error: string;
  errorActive: string;
  errorBg: string;
  errorBgHover: string;
  errorHover: string;
  errorBorder: string;
  errorBorderSecondary: string;
  info: string;
  infoActive: string;
  infoBg: string;
  infoBgHover: string;
  infoHover: string;
  infoBorder: string;
  infoBorderSecondary: string;
  success: string;
  successActive: string;
  successBg: string;
  successBgHover: string;
  successHover: string;
  successBorder: string;
  successBorderSecondary: string;
  warning: string;
  warningActive: string;
  warningBg: string;
  warningBgHover: string;
  warningHover: string;
  warningBorder: string;
  warningBorderSecondary: string;
  container: string;
  elevated: string;
  layout: string;
  bgMask: string;
  spotlight: string;
  border: string;
  borderSecondary: string;
  fill: string;
  fillQuaternary: string;
  fillSecondary: string;
  fillTertiary: string;
  text: string;
  textQuaternary: string;
  textSecondary: string;
  textTertiary: string;
};

const genTheme = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  return THEME_KEYS.reduce((prev, curr) => {
    const value = rootStyles.getPropertyValue(`--${kebabCase(curr)}`).trim();
    return {
      ...prev,
      [curr]: `hsla(${value.replace(/ \/ | /g, ':string,')})`,
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
