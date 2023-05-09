import Color from 'color';
import { PluginAPI } from 'tailwindcss/types/config';
import colorObject from '.';
import themes from './themes';

type ColorParam = string | { [key: string]: any };

function generateForegroundColorFrom(input: ColorParam, percentage = 0.8) {
  if (Color(input).isDark()) {
    let arr = Color(input).mix(Color('white'), percentage).saturate(10).hsl().array();
    console.log(arr);
    return (
      arr[0].toPrecision(5).replace(/\.?0+$/, '') +
      ' ' +
      arr[1].toPrecision(5).replace(/\.?0+$/, '') +
      '%' +
      ' ' +
      arr[2].toPrecision(5).replace(/\.?0+$/, '') +
      '%'
    );
  } else {
    let arr = Color(input).mix(Color('black'), percentage).saturate(10).hsl().array();
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

      // auto generate active colors
      if (!input.hasOwnProperty('primary-active')) {
        const darkerHslArray = Color(input['primary']).darken(0.2).hsl().array();
        resultObj['--primary-active'] =
          darkerHslArray[0].toPrecision(5).replace(/\.?0+$/, '') +
          ' ' +
          darkerHslArray[1].toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' ' +
          darkerHslArray[2].toPrecision(5).replace(/\.?0+$/, '') +
          '%';
      }

      if (!input.hasOwnProperty('secondary-active')) {
        const darkerHslArray = Color(input['secondary']).darken(0.2).hsl().array();
        resultObj['--secondary-active'] =
          darkerHslArray[0].toPrecision(5).replace(/\.?0+$/, '') +
          ' ' +
          darkerHslArray[1].toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' ' +
          darkerHslArray[2].toPrecision(5).replace(/\.?0+$/, '') +
          '%';
      }

      if (!input.hasOwnProperty('accent-active')) {
        const darkerHslArray = Color(input['accent']).darken(0.2).hsl().array();
        resultObj['--accent-active'] =
          darkerHslArray[0].toPrecision(5).replace(/\.?0+$/, '') +
          ' ' +
          darkerHslArray[1].toPrecision(5).replace(/\.?0+$/, '') +
          '%' +
          ' ' +
          darkerHslArray[2].toPrecision(5).replace(/\.?0+$/, '') +
          '%';
      }

      if (!input.hasOwnProperty('primary-content')) {
        resultObj['--primary-content'] = generateForegroundColorFrom(input['primary']);
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
