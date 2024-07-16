import { TinyColor } from '@ctrl/tinycolor';
import get from 'lodash/get';
import twColors from 'tailwindcss/colors';
import { PluginAPI } from 'tailwindcss/types/config';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import colorPalette from './colorPalette';
import { PREFERS_COLOR_KEY } from './constants';
import themes from './themes';

type ColorParam = { [key: string]: any };
type ColorScheme = 'light' | 'dark';

function getWeightByOffset(base: number, offset: number) {
  const values = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const baseIndex = values.indexOf(base);

  let offsetIndex = Math.min(Math.max(0, baseIndex + offset), values.length - 1);

  return values[offsetIndex];
}

function generateColorPaletteFrom(
  scheme: ColorScheme = 'light',
  base: string,
  color: string,
  skip: string[],
): Record<string, { color: string; alpha?: number }> {
  const [colorType, colorWeight] = color.split('-') as [keyof DefaultColors, string | undefined];

  const baseColor: string = get(twColors, [colorType, colorWeight].filter(Boolean) as string[]);
  if (!baseColor) {
    return { [base]: { color } };
  }

  const palette = colorPalette[scheme];

  const resultObj = { [base]: { color: baseColor } };

  if (!(base in palette)) return resultObj;

  return Object.entries(palette[base as keyof typeof palette]).reduce((perv, [k, v]) => {
    const key = `${base}-${k}`;
    if (skip.includes(key) || (!colorWeight && Number.isInteger(v))) return perv;
    return {
      ...perv,
      // 小数表示透明度，整数表示 tailwind 色阶差
      [key]: Number.isInteger(v)
        ? { color: get(twColors, [colorType, getWeightByOffset(Number(colorWeight), v)]) }
        : { color: baseColor, alpha: v * 100 },
    };
  }, resultObj);
}

export function convertToHsl(input: ColorParam) {
  let resultObj: Record<string, any> = {};
  Object.entries(input).forEach(([rule, value]) => {
    if (rule !== 'color-scheme') {
      const [color, alpha = 100] = value.split('/');
      const colorPalette = generateColorPaletteFrom(
        input['color-scheme'] as ColorScheme,
        rule,
        color,
        Object.keys(input),
      );
      Object.entries(colorPalette).forEach(([k, v]) => {
        const hsl = new TinyColor(v.color).toHsl();

        resultObj[`--${k}`] =
          hsl.h.toPrecision(5).replace(/\.?0+$/, '') +
          ' ' +
          (hsl.s * 100).toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' ' +
          (hsl.l * 100).toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' / ' +
          (v.alpha ?? alpha) / 100;
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
  if (Array.isArray(config('metisui.themes'))) {
    config('metisui.themes').forEach((item: { [key: string]: any }) => {
      if (typeof item === 'object' && item !== null) {
        Object.entries(item).forEach(([name, value]) => {
          includedThemesObj[name] = convertToHsl(value);
          themeOrder.push(name);
        });
      } else if (typeof item === 'string' && includedThemesObj.hasOwnProperty(item)) {
        themeOrder.push(item);
      }
    });
  } else if (config<boolean>('metisui.themes') !== false) {
    themeOrder = ['light', 'dark'];
  } else if (config<boolean>('metisui.themes') === false) {
    themeOrder.push('light');
  }

  // inject themes in order
  themeOrder.forEach((themeName, index) => {
    if (index === 0) {
      // first theme as root
      addBase({
        [':root']: includedThemesObj[themeName],
      });
    }

    addBase({
      [`[${PREFERS_COLOR_KEY}=${themeName}]`]: includedThemesObj[themeName],
    });
  });
  if (config('metisui.darkTheme')) {
    const darkTheme = config<boolean | string>('metisui.darkTheme');
    const theme = typeof darkTheme === 'string' ? darkTheme : 'dark';

    if (themeOrder.includes(theme)) {
      addBase({
        ['@media (prefers-color-scheme: dark)']: {
          [':root']: includedThemesObj[theme],
        },
      });
    }
  }
}
