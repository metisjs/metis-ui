import colors from './colors';

export default {
  theme: {
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
    },
    extend: {
      colors: {
        ...colors,
      },
      opacity: {
        disabled: '0.3',
      },
      // transitionProperty: {},
      keyframes: {
        'bounce-spin': {
          '0%, 100%': {
            transform: 'scaleY(0.4)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'scaleY(1)',
            opacity: '1',
          },
        },
        'progress-active': {
          '0%': {
            transform: `translateX(-100%) scaleX(0)`,
            opacity: '0.1',
          },
          '20%': {
            transform: `translateX(-100%) scaleX(0)`,
            opacity: '0.5',
          },
          to: {
            transform: 'translateX(0) scaleX(1)',
            opacity: '0',
          },
        },
        'slide-left-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-right-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-left-out': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'slide-right-out': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'slide-top-in': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-bottom-in': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-top-out': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-100%)' },
        },
        'slide-bottom-out': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
      },
    },
  },
};