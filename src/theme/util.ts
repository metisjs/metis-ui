import omit from '@rc-component/util/es/omit';
import get from '@rc-component/util/es/utils/get';
import twColors from 'tailwindcss/colors';
import type { PluginAPI } from 'tailwindcss/plugin';
import type { ThemeOptions } from '.';
import { PREFERS_COLOR_KEY, SYS_DATA_THEME } from '../plugin/constants';
import colorPalette from './colorPalette';

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
): Record<string, { color: string; alpha?: number; tw: boolean }> {
  const [colorType, colorWeight] = color.split('-') as [string, string | undefined];

  const isTWColor = !!get(twColors, [colorType, colorWeight].filter(Boolean) as string[]);
  if (!isTWColor) {
    return { [base]: { color, tw: false } };
  }

  const palette = colorPalette[scheme];

  const resultObj = { [base]: { color, tw: true } };

  if (!(base in palette)) return resultObj;

  return Object.entries(palette[base as keyof typeof palette]).reduce((perv, [k, v]) => {
    const key = `${base}-${k}`;
    if (skip.includes(key) || (!colorWeight && Number.isInteger(v))) return perv;
    return {
      ...perv,
      // 小数表示透明度，整数表示 tailwind 色阶差
      [key]: Number.isInteger(v)
        ? { color: `${colorType}-${getWeightByOffset(Number(colorWeight), v)}`, tw: true }
        : { color: color, alpha: v * 100, tw: true },
    };
  }, resultObj);
}

export function genThemeVariables(input: ColorParam) {
  let resultObj: Record<string, any> = {};
  Object.entries(input).forEach(([rule, value]) => {
    if (!['color-scheme', 'name', 'default', 'dark'].includes(rule)) {
      const [color, alpha = 100] = value.split('/');
      const colorPalette = generateColorPaletteFrom(
        input['color-scheme'] as ColorScheme,
        rule,
        color,
        Object.keys(input),
      );

      Object.entries(colorPalette).forEach(([k, v]) => {
        // 是否为tailwind预设色
        if (v.tw) {
          resultObj[`--${k}`] = `var(--color-${v.color})`;

          if ((v.alpha ?? alpha) !== 100) {
            resultObj[`--${k}`] =
              `color-mix(in oklab, ${resultObj[`--${k}`]} ${v.alpha ?? alpha}%, transparent)`;
          }
        } else {
          resultObj[`--${k}`] = v.color;
        }
      });
    } else {
      resultObj[rule] = value;
    }
  });
  return resultObj;
}

export function applyThemes(themes: ThemeOptions[], addBase: PluginAPI['addBase']) {
  const darkTheme = themes.find((theme) => theme.dark);
  if (darkTheme) {
    addBase({
      '@media (prefers-color-scheme: dark)': {
        [`[${PREFERS_COLOR_KEY}='${SYS_DATA_THEME}'], [${PREFERS_COLOR_KEY}='${SYS_DATA_THEME}'] *`]:
          omit(darkTheme, ['dark', 'name', 'default']),
      },
    });
  }

  themes.forEach((theme) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name = 'custom-theme', default: isDefault = false, dark, ...variables } = theme;

    let selector = `[${PREFERS_COLOR_KEY}=${name}]`;
    if (isDefault) {
      selector = `:where(:root),${selector}`;
    }
    addBase({ [selector]: variables });
  });
}
