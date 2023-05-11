function withOpacityValue(variable: string) {
  return `hsla(var(${variable}) / <alpha-value>)`;
}

const colorObject = {
  transparent: 'transparent',
  current: 'currentColor',

  /** 品牌色 */
  primary: {
    DEFAULT: withOpacityValue('--primary'),
    bg: withOpacityValue('--primary-bg'),
    'bg-hover': withOpacityValue('--primary-bg-hover'),
    hover: withOpacityValue('--primary-hover'),
    active: withOpacityValue('--primary-active'),
    'text-hover': withOpacityValue('--primary-text-hover'),
    text: withOpacityValue('--primary-text'),
    'text-active': withOpacityValue('--primary-text-active'),
  },

  /** 成功色 */
  success: {
    DEFAULT: withOpacityValue('--success'),
    bg: withOpacityValue('--success-bg'),
    'bg-hover': withOpacityValue('--success-bg-hover'),
    hover: withOpacityValue('--success-hover'),
    active: withOpacityValue('--success-active'),
    'text-hover': withOpacityValue('--success-text-hover'),
    text: withOpacityValue('--success-text'),
    'text-active': withOpacityValue('--success-text-active'),
  },

  /** 警戒色 */
  warning: {
    DEFAULT: withOpacityValue('--warning'),
    bg: withOpacityValue('--warning-bg'),
    'bg-hover': withOpacityValue('--warning-bg-hover'),
    hover: withOpacityValue('--warning-hover'),
    active: withOpacityValue('--warning-active'),
    'text-hover': withOpacityValue('--warning-text-hover'),
    text: withOpacityValue('--warning-text'),
    'text-active': withOpacityValue('--warning-text-active'),
  },

  /** 错误色 */
  error: {
    DEFAULT: withOpacityValue('--error'),
    bg: withOpacityValue('--error-bg'),
    'bg-hover': withOpacityValue('--info-bg-hover'),
    hover: withOpacityValue('--error-hover'),
    active: withOpacityValue('--error-active'),
    'text-hover': withOpacityValue('--error-text-hover'),
    text: withOpacityValue('--error-text'),
    'text-active': withOpacityValue('--error-text-active'),
  },

  /** 信息色 */
  info: {
    DEFAULT: withOpacityValue('--info'),
    bg: withOpacityValue('--info-bg'),
    'bg-hover': withOpacityValue('--info-bg-hover'),
    hover: withOpacityValue('--info-hover'),
    active: withOpacityValue('--info-active'),
    'text-hover': withOpacityValue('--info-text-hover'),
    text: withOpacityValue('--info-text'),
    'text-active': withOpacityValue('--info-text-active'),
  },

  /** 中性色 */
  text: withOpacityValue('--text'),
  'text-secondary': withOpacityValue('--text-secondary'),
  'text-tertiary': withOpacityValue('--text-tertiary'),
  'text-quaternary': withOpacityValue('--text-quaternary'),
  border: withOpacityValue('--border'),
  'border-secondary': withOpacityValue('--border-secondary'),
  'bg-container': withOpacityValue('--bg-container'),
  'bg-elevated': withOpacityValue('--bg-elevated'),
  'bg-layout': withOpacityValue('--bg-layout'),
  'bg-spotlight': withOpacityValue('--bg-spotlight'),
  'bg-mask': withOpacityValue('--bg-mask'),
};

export default colorObject;
