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
    border: 'hsla(var(--primary-border))',
    'border-secondary': 'hsla(var(--primary-border-secondary))',
  },

  /** 成功色 */
  success: {
    DEFAULT: 'hsla(var(--success))',
    bg: 'hsla(var(--success-bg))',
    'bg-hover': 'hsla(var(--success-bg-hover))',
    hover: 'hsla(var(--success-hover))',
    active: 'hsla(var(--success-active))',
    border: 'hsla(var(--success-border))',
    'border-secondary': 'hsla(var(--success-border-secondary))',
  },

  /** 警戒色 */
  warning: {
    DEFAULT: 'hsla(var(--warning))',
    bg: 'hsla(var(--warning-bg))',
    'bg-hover': 'hsla(var(--warning-bg-hover))',
    hover: 'hsla(var(--warning-hover))',
    active: 'hsla(var(--warning-active))',
    border: 'hsla(var(--warning-border))',
    'border-secondary': 'hsla(var(--warning-border-secondary))',
  },

  /** 错误色 */
  error: {
    DEFAULT: 'hsla(var(--error))',
    bg: 'hsla(var(--error-bg))',
    'bg-hover': 'hsla(var(--error-bg-hover))',
    hover: 'hsla(var(--error-hover))',
    active: 'hsla(var(--error-active))',
    border: 'hsla(var(--error-border))',
    'border-secondary': 'hsla(var(--error-border-secondary))',
  },

  /** 信息色 */
  info: {
    DEFAULT: 'hsla(var(--info))',
    bg: 'hsla(var(--info-bg))',
    'bg-hover': 'hsla(var(--info-bg-hover))',
    hover: 'hsla(var(--info-hover))',
    active: 'hsla(var(--info-active))',
    border: 'hsla(var(--info-border))',
    'border-secondary': 'hsla(var(--info-border-secondary))',
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
    'fill-tertiary': 'hsla(var(--neutral-fill-tertiary))',
    'fill-quaternary': 'hsla(var(--neutral-fill-quaternary))',
    'fill-quinary': 'hsla(var(--neutral-fill-quinary))',
    'bg-container': 'hsla(var(--neutral-bg-container))',
    'bg-elevated': 'hsla(var(--neutral-bg-elevated))',
    'bg-layout': 'hsla(var(--neutral-bg-layout))',
    'bg-spotlight': 'hsla(var(--neutral-bg-spotlight))',
    'bg-mask': 'hsla(var(--neutral-bg-mask))',
  },
};

export default colorObject;
