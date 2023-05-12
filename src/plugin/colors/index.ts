const colorObject = {
  transparent: 'transparent',
  current: 'currentColor',

  /** 品牌色 */
  primary: {
    DEFAULT: 'hsla(var(--primary))',
    bg: 'hsla(var(--primary-bg))',
    'bg-hover': 'hsla(var(--primary-bg-hover))',
    hover: 'hsla(var(--primary-hover))',
    active: 'hsla(var(--primary-active))',
    'text-hover': 'hsla(var(--primary-text-hover))',
    text: 'hsla(var(--primary-text))',
    'text-active': 'hsla(var(--primary-text-active))',
  },

  /** 成功色 */
  success: {
    DEFAULT: 'hsla(var(--success))',
    bg: 'hsla(var(--success-bg))',
    'bg-hover': 'hsla(var(--success-bg-hover))',
    hover: 'hsla(var(--success-hover))',
    active: 'hsla(var(--success-active))',
    'text-hover': 'hsla(var(--success-text-hover))',
    text: 'hsla(var(--success-text))',
    'text-active': 'hsla(var(--success-text-active))',
  },

  /** 警戒色 */
  warning: {
    DEFAULT: 'hsla(var(--warning))',
    bg: 'hsla(var(--warning-bg))',
    'bg-hover': 'hsla(var(--warning-bg-hover))',
    hover: 'hsla(var(--warning-hover))',
    active: 'hsla(var(--warning-active))',
    'text-hover': 'hsla(var(--warning-text-hover))',
    text: 'hsla(var(--warning-text))',
    'text-active': 'hsla(var(--warning-text-active))',
  },

  /** 错误色 */
  error: {
    DEFAULT: 'hsla(var(--error))',
    bg: 'hsla(var(--error-bg))',
    'bg-hover': 'hsla(var(--info-bg-hover))',
    hover: 'hsla(var(--error-hover))',
    active: 'hsla(var(--error-active))',
    'text-hover': 'hsla(var(--error-text-hover))',
    text: 'hsla(var(--error-text))',
    'text-active': 'hsla(var(--error-text-active))',
  },

  /** 信息色 */
  info: {
    DEFAULT: 'hsla(var(--info))',
    bg: 'hsla(var(--info-bg))',
    'bg-hover': 'hsla(var(--info-bg-hover))',
    hover: 'hsla(var(--info-hover))',
    active: 'hsla(var(--info-active))',
    'text-hover': 'hsla(var(--info-text-hover))',
    text: 'hsla(var(--info-text))',
    'text-active': 'hsla(var(--info-text-active))',
  },

  /** 中性色 */
  neutral: {
    text: `hsla(var(--neutral-text))`,
    'text-secondary': 'hsla(var(--neutral-text-secondary))',
    'text-tertiary': 'hsla(var(--neutral-text-tertiary))',
    'text-quaternary': 'hsla(var(--neutral-text-quaternary))',
    border: 'hsla(var(--neutral-border))',
    'border-secondary': 'hsla(var(--neutral-border-secondary))',
    fill: `hsla(var(--neutral-fill))`,
    'fill-secondary': 'hsla(var(--neutral-fill-secondary))',
    'bg-container': 'hsla(var(--neutral-bg-container))',
    'bg-elevated': 'hsla(var(--neutral-bg-elevated))',
    'bg-layout': 'hsla(var(--neutral-bg-layout))',
    'bg-spotlight': 'hsla(var(--neutral-bg-spotlight))',
    'bg-mask': 'hsla(var(--neutral-bg-mask))',
  },
};

export default colorObject;
