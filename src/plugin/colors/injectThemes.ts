import Color from 'color';
import { PluginAPI } from 'tailwindcss/types/config';
import colorObject from '.';
import themes from './themes';

type ColorParam = string | { [key: string]: any };

function generateForegroundColorFrom(input: ColorParam, percentage = 1) {
  const arr = Color(input)
    .mix(Color(Color(input).isDark() ? 'white' : 'black'), percentage)
    .saturate(10)
    .hsl()
    .array();
    
  return (
    arr[0].toPrecision(5).replace(/\.?0+$/, '') +
    ' ' +
    arr[1].toPrecision(5).replace(/\.?0+$/, '') +
    '%' +
    ' ' +
    arr[2].toPrecision(5).replace(/\.?0+$/, '') +
    '%'
  );
}

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

      if (!input.hasOwnProperty('primary-foreground')) {
        resultObj['--primary-foreground'] = generateForegroundColorFrom(input['primary']);
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
