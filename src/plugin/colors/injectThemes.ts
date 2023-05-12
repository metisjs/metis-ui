import Color from 'color';
import get from 'lodash/get';
import twColors from 'tailwindcss/colors';
import { PluginAPI } from 'tailwindcss/types/config';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import themes from './themes';

type ColorParam = { [key: string]: any };

const COLOR_OFFSET = {
  primary: {
    bg: -6,
    'bg-hover': -5,
    hover: -1,
    active: 1,
    'text-hover': -1,
    text: 0,
    'text-active': 1,
  },
  success: {
    bg: -4,
    'bg-hover': -3,
    hover: -1,
    active: 1,
    'text-hover': 2,
    text: 3,
    'text-active': 4,
  },
  warning: {
    bg: -4,
    'bg-hover': -3,
    hover: -1,
    active: 1,
    'text-hover': 2,
    text: 3,
    'text-active': 4,
  },
  error: {
    bg: -4,
    'bg-hover': -3,
    hover: -1,
    active: 1,
    'text-hover': 2,
    text: 3,
    'text-active': 4,
  },
  info: {
    bg: -4,
    'bg-hover': -3,
    hover: -1,
    active: 1,
    'text-hover': 2,
    text: 3,
    'text-active': 4,
  },
  'neutral-text': {
    secondary: -2,
    tertiary: -2,
    quaternary: -2,
  },
  'neutral-border': { secondary: -2 },
  'neutral-fill': { secondary: -1 },
} as const;

function getWeightByOffset(base: number, offset: number) {
  const values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const baseIndex = values.indexOf(base);

  let offsetIndex = Math.min(Math.max(0, baseIndex + offset), values.length - 1);

  return values[offsetIndex];
}

function generateColorPaletteFrom(base: string, color: string, skip: string[]) {
  const [colorType, colorWeight] = color.split('-') as [keyof DefaultColors, string | undefined];

  const baseColor: string = get(twColors, [colorType, colorWeight].filter(Boolean) as string[]);

  if (!baseColor) {
    return { [base]: color };
  }

  const resultObj = { [base]: baseColor };

  if (!colorWeight || !(base in COLOR_OFFSET)) return resultObj;

  return Object.entries(COLOR_OFFSET[base as keyof typeof COLOR_OFFSET]).reduce((perv, [k, v]) => {
    const key = `${base}-${k}`;
    if (skip.includes(key)) return perv;

    return {
      ...perv,
      [key]: get(twColors, [colorType, getWeightByOffset(Number(colorWeight), v)]),
    };
  }, resultObj);
}

function convertToHsl(input: ColorParam) {
  let resultObj: Record<string, any> = {};
  Object.entries(input).forEach(([rule, value]) => {
    if (rule !== 'color-scheme') {
      const [color, alpha = 100] = value.split('/');
      const colorPalette = generateColorPaletteFrom(rule, color, Object.keys(input));
      Object.entries(colorPalette).forEach(([k, v]) => {
        const hslArray = Color(v).hsl().array();

        resultObj[`--${k}`] =
          hslArray[0].toPrecision(5).replace(/\.?0+$/, '') +
          ' ' +
          hslArray[1].toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' ' +
          hslArray[2].toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' / ' +
          alpha / 100;
      });
    } else {
      resultObj[rule] = value;
    }
  });
  return resultObj;
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
          includedThemesObj['[data-prefers-color=' + name + ']'] = convertToHsl(value);
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
        [':root']: includedThemesObj['[data-prefers-color=' + themeName + ']'],
      });
    }

    addBase({
      ['[data-prefers-color=' + themeName + ']']:
        includedThemesObj['[data-prefers-color=' + themeName + ']'],
    });
  });
  if (config('metaui.themeWithSystem')) {
    const themeWithSystem = config<boolean | string>('metaui.themeWithSystem');
    const darkTheme = typeof themeWithSystem === 'string' ? themeWithSystem : 'dark';

    if (themeWithSystem && themeOrder.includes(darkTheme)) {
      addBase({
        ['@media (prefers-color-scheme: dark)']: {
          [':root']: includedThemesObj[`[data-prefers-color=${darkTheme}]`],
        },
      });
    }
  }

  return {
    includedThemesObj,
    themeOrder: themeOrder,
  };
}
