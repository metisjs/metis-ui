import { useMemo } from 'react';
import { convertToHsl } from '../../preset/colors/injectThemes';
import themes from '../../preset/colors/themes';

type ThemeColors = {
  error: string;
  errorActive: string;
  errorBg: string;
  errorBgHover: string;
  errorHover: string;
  errorText: string;
  errorTextActive: string;
  errorTextHover: string;
  info: string;
  infoActive: string;
  infoBg: string;
  infoBgHover: string;
  infoHover: string;
  infoText: string;
  infoTextActive: string;
  infoTextHover: string;
  neutralBgContainer: string;
  neutralBgElevated: string;
  neutralBgLayout: string;
  neutralBgMask: string;
  neutralBgSpotlight: string;
  neutralBorder: string;
  neutralBorderSecondary: string;
  neutralFill: string;
  neutralFillQuaternary: string;
  neutralFillSecondary: string;
  neutralFillTertiary: string;
  neutralText: string;
  neutralTextQuaternary: string;
  neutralTextSecondary: string;
  neutralTextTertiary: string;
  primary: string;
  primaryActive: string;
  primaryBg: string;
  primaryBgHover: string;
  primaryHover: string;
  primaryText: string;
  primaryTextActive: string;
  primaryTextHover: string;
  success: string;
  successActive: string;
  successBg: string;
  successBgHover: string;
  successHover: string;
  successText: string;
  successTextActive: string;
  successTextHover: string;
  warning: string;
  warningActive: string;
  warningBg: string;
  warningBgHover: string;
  warningHover: string;
  warningText: string;
  warningTextActive: string;
  warningTextHover: string;
};

export default function useTheme(): ThemeColors {
  const theme = document.querySelector('[data-prefers-color]')!.getAttribute('data-prefers-color');

  const colors = useMemo(() => {
    const _colors = convertToHsl(themes[`[data-prefers-color=${theme}]` as keyof typeof themes]);
    return Object.fromEntries(
      Object.entries(_colors)
        .filter(([key]) => key !== 'color-scheme')
        .map(([key, val]) => [
          key.replace('--', '').replace(/[-_](.)/g, (_, c) => c.toUpperCase()),
          `hsla(${val.replace(/ \/ | /g, ',')})`,
        ]),
    ) as ThemeColors;
  }, [theme]);

  return colors;
}
