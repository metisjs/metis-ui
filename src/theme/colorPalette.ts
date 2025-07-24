const lightBase = {
  bg: -5,
  'bg-hover': -4,
  hover: -1,
  active: 1,
  border: -2,
  'border-secondary': 0.2,
};

const darkBase = {
  bg: 5,
  'bg-hover': 4,
  hover: 1,
  active: -1,
  border: 2,
  'border-secondary': 0.2,
};

/**
 * 色阶推导规则，小数表示透明度，整数表示 tailwind 色阶差
 */
export default {
  light: {
    primary: {
      bg: -6,
      'bg-hover': -4,
      hover: -1,
      active: 1,
      border: -3,
      'border-secondary': 0.1,
    },
    success: lightBase,
    warning: lightBase,
    error: lightBase,
    text: {
      secondary: -4,
      tertiary: -5,
      quaternary: -6,
    },
    border: { secondary: -1, tertiary: -2 },
    fill: { secondary: 0.15, tertiary: 0.1, quaternary: 0.05, quinary: 0.02 },
  },
  dark: {
    primary: darkBase,
    success: darkBase,
    warning: darkBase,
    error: darkBase,
    text: {
      secondary: 0.65,
      tertiary: 0.45,
      quaternary: 0.25,
    },
    border: { secondary: 2 },
    fill: { secondary: 0.15, tertiary: 0.1, quaternary: 0.05, quinary: 0.02 },
  },
} as const;
