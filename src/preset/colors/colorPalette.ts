const lightBase = {
  bg: -5,
  'bg-hover': -4,
  hover: -1,
  active: 1,
  border: 0.2,
};

const darkBase = {
  bg: 5,
  'bg-hover': 4,
  hover: 1,
  active: -1,
  border: 0.2,
};

/**
 * 色阶推导规则，小数表示透明度，整数表示 tailwind 色阶差
 */
export default {
  light: {
    primary: {
      bg: -6,
      'bg-hover': -5,
      hover: -1,
      active: 1,
      border: 0.1,
    },
    success: lightBase,
    warning: lightBase,
    error: lightBase,
    info: lightBase,
    'neutral-text': {
      secondary: 0.65,
      tertiary: 0.45,
      quaternary: 0.25,
    },
    'neutral-border': { secondary: -1 },
    // 'neutral-fill': { secondary: -1, tertiary: -2, quaternary: -3 },
    'neutral-fill': { secondary: 0.12, tertiary: 0.08, quaternary: 0.04 },
  },
  dark: {
    primary: {
      bg: 6,
      'bg-hover': -5,
      hover: -1,
      active: 1,
      border: 0.1,
    },
    success: darkBase,
    warning: darkBase,
    error: darkBase,
    info: darkBase,
    'neutral-text': {
      secondary: 0.65,
      tertiary: 0.45,
      quaternary: 0.25,
    },
    'neutral-border': { secondary: 2 },
    'neutral-fill': { secondary: 0.12, tertiary: 0.08, quaternary: 0.04 },
  },
} as const;
