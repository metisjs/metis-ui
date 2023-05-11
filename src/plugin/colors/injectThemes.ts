import Color from 'color';
import { PluginAPI } from 'tailwindcss/types/config';
import colorObject from '.';
import themes from './themes';

type ColorParam = string | { [key: string]: any };

const BASE_LEVEL = {
  bg: -4,
  'bg-hover': -3,
  hover: -1,
  active: 1,
  'text-hover': 2,
  text: 3,
  'text-active': 4,
} as const;
const COLOR_LEVEL = {
  primary: {
    bg: -6,
    'bg-hover': -5,
    hover: -1,
    active: 1,
    'text-hover': -1,
    text: 0,
    'text-active': 1,
  },
  success: BASE_LEVEL,
  warning: BASE_LEVEL,
  error: BASE_LEVEL,
  info: BASE_LEVEL,
  text: {
    secondary: -2,
    tertiary: -2,
    quaternary: -2,
  },
  border: { secondary: -2 },
} as const;

function generateColorPaletteFrom(base: string, color: string) {}

function convertToHsl(input: ColorParam) {
  let resultObj: Record<string, any> = {};
  if (typeof input === 'object' && input !== null) {
    Object.entries(input).forEach(([rule, value]) => {
      if (colorObject.hasOwnProperty(rule)) {
        const hslArray = Color(value).hsl().array();
        resultObj[`--${rule}`] =
          hslArray[0].toPrecision(5).replace(/\.?0+$/, '') +
          ' ' +
          hslArray[1].toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' ' +
          hslArray[2].toPrecision(5).replace(/\.?0+$/, '') +
          '%';
      } else {
        resultObj[rule] = value;
      }
    });
    return resultObj;
  }
  return input;
}

export default function injectThemes(addBase: PluginAPI['addBase'], config: PluginAPI['config']) {
  let includedThemesObj: Record<string, any> = {};
  let themeOrder: string[] = [];

  Object.entries(themes).forEach(([theme, value]) => {
    includedThemesObj[theme] = convertToHsl(value);
  });

  // add custom themes
  if (Array.isArray(config('metaui.themes'))) {
    config('metaui.themes').forEach((item: { [key: string]: any }) => {
      if (typeof item === 'object' && item !== null) {
        Object.entries(item).forEach(([name, value]) => {
          includedThemesObj['[data-theme=' + name + ']'] = convertToHsl(value);
          themeOrder.push(name);
        });
      }
    });
  } else if (config<boolean>('metaui.themes') !== false) {
    themeOrder = ['light', 'dark'];
  } else if (config<boolean>('metaui.themes') === false) {
    themeOrder.push('light');
  }

  // inject themes in order
  themeOrder.forEach((themeName, index) => {
    if (index === 0) {
      // first theme as root
      addBase({
        [':root']: includedThemesObj['[data-theme=' + themeName + ']'],
      });
    }

    addBase({
      ['[data-theme=' + themeName + ']']: includedThemesObj['[data-theme=' + themeName + ']'],
    });
  });

  if (config('metaui.themeWithSystem')) {
    const themeWithSystem = config<boolean | string>('metaui.themeWithSystem');
    const darkTheme = typeof themeWithSystem === 'string' ? themeWithSystem : 'dark';

    if (themeWithSystem && themeOrder.includes(darkTheme)) {
      addBase({
        ['@media (prefers-color-scheme: dark)']: {
          [':root']: includedThemesObj[`[data-theme=${darkTheme}]`],
        },
      });
    }
  }

  return {
    includedThemesObj,
    themeOrder: themeOrder,
  };
}
