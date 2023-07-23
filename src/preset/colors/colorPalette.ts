const lightBase = {
  bg: -4,
  'bg-hover': -3,
  hover: -1,
  active: 1,
  'text-hover': 1,
  text: 2,
  'text-active': 3,
};

const darkBase = {
  bg: 5,
  'bg-hover': 4,
  hover: -1,
  active: 1,
  'text-hover': 1,
  text: -2,
  'text-active': -3,
};

export default {
  light: {
    primary: {
      bg: -6,
      'bg-hover': -5,
      hover: -1,
      active: 1,
      'text-hover': -1,
      text: 0,
      'text-active': 1,
    },
    success: lightBase,
    warning: lightBase,
    error: lightBase,
    info: lightBase,
    'neutral-text': {
      secondary: -4,
      tertiary: -5,
      quaternary: -6,
    },
    'neutral-border': { secondary: -1 },
    'neutral-fill': { secondary: -1, tertiary: -2, quaternary: -3 },
  },
  dark: {
    primary: {
      bg: -6,
      'bg-hover': -5,
      hover: -1,
      active: 1,
      'text-hover': -1,
      text: 0,
      'text-active': 1,
    },
    success: darkBase,
    warning: darkBase,
    error: darkBase,
    info: darkBase,
    'neutral-border': { secondary: 2 },
  },
} as const;
