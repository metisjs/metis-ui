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

  /** 文字色 */
  text: {
    DEFAULT: `hsla(var(--text))`,
    secondary: 'hsla(var(--text-secondary))',
    tertiary: 'hsla(var(--text-tertiary))',
    quaternary: 'hsla(var(--text-quaternary))',
  },

  /** 边框色 */
  border: {
    DEFAULT: 'hsla(var(--border))',
    secondary: 'hsla(var(--border-secondary))',
  },

  /** 填充色 */
  fill: {
    DEFAULT: 'hsla(var(--fill))',
    secondary: 'hsla(var(--fill-secondary))',
    tertiary: 'hsla(var(--fill-tertiary))',
    quaternary: 'hsla(var(--fill-quaternary))',
    quinary: 'hsla(var(--fill-quinary))',
  },

  /** 组件容器背景 */
  container: {
    DEFAULT: 'hsla(var(--container))',
  },

  /** 浮层容器背景色 */
  elevated: {
    DEFAULT: 'hsla(var(--elevated))',
  },

  /** 布局背景色 */
  layout: {
    DEFAULT: 'hsla(var(--layout))',
  },

  /** 引起注意的背景色 */
  spotlight: {
    DEFAULT: 'hsla(var(--spotlight))',
  },

  /** 浮层的背景蒙层颜色 */
  mask: {
    DEFAULT: 'hsla(var(--mask))',
  },

  /** 滚动组件滚动条颜色 */
  scrollbar: {
    track: 'hsla(var(--scrollbar-track))',
    thumb: 'hsla(var(--scrollbar-thumb))',
  },
};

export default colorObject;
