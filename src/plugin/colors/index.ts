const colorObject = {
  transparent: 'transparent',
  current: 'currentColor',

  /** 品牌色 */
  primary: {
    DEFAULT: 'var(--primary)',
    bg: 'var(--primary-bg)',
    'bg-hover': 'var(--primary-bg-hover)',
    hover: 'var(--primary-hover)',
    active: 'var(--primary-active)',
    border: 'var(--primary-border)',
    'border-secondary': 'var(--primary-border-secondary)',
  },

  /** 成功色 */
  success: {
    DEFAULT: 'var(--success)',
    bg: 'var(--success-bg)',
    'bg-hover': 'var(--success-bg-hover)',
    hover: 'var(--success-hover)',
    active: 'var(--success-active)',
    border: 'var(--success-border)',
    'border-secondary': 'var(--success-border-secondary)',
  },

  /** 警戒色 */
  warning: {
    DEFAULT: 'var(--warning)',
    bg: 'var(--warning-bg)',
    'bg-hover': 'var(--warning-bg-hover)',
    hover: 'var(--warning-hover)',
    active: 'var(--warning-active)',
    border: 'var(--warning-border)',
    'border-secondary': 'var(--warning-border-secondary)',
  },

  /** 错误色 */
  error: {
    DEFAULT: 'var(--error)',
    bg: 'var(--error-bg)',
    'bg-hover': 'var(--error-bg-hover)',
    hover: 'var(--error-hover)',
    active: 'var(--error-active)',
    border: 'var(--error-border)',
    'border-secondary': 'var(--error-border-secondary)',
  },

  /** 信息色 */
  info: {
    DEFAULT: 'var(--info)',
    bg: 'var(--info-bg)',
    'bg-hover': 'var(--info-bg-hover)',
    hover: 'var(--info-hover)',
    active: 'var(--info-active)',
    border: 'var(--info-border)',
    'border-secondary': 'var(--info-border-secondary)',
  },

  /** 文字色 */
  text: {
    DEFAULT: `var(--text)`,
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    quaternary: 'var(--text-quaternary)',
  },

  /** 边框色 */
  border: {
    DEFAULT: 'var(--border)',
    secondary: 'var(--border-secondary)',
    tertiary: 'var(--border-tertiary)',
  },

  /** 填充色 */
  fill: {
    DEFAULT: 'var(--fill)',
    secondary: 'var(--fill-secondary)',
    tertiary: 'var(--fill-tertiary)',
    quaternary: 'var(--fill-quaternary)',
    quinary: 'var(--fill-quinary)',
  },

  /** 组件容器背景 */
  container: {
    DEFAULT: 'var(--container)',
  },

  /** 浮层容器背景色 */
  elevated: {
    DEFAULT: 'var(--elevated)',
  },

  /** 布局背景色 */
  layout: {
    DEFAULT: 'var(--layout)',
  },

  /** 引起注意的背景色 */
  spotlight: {
    DEFAULT: 'var(--spotlight)',
  },

  /** 浮层的背景蒙层颜色 */
  mask: {
    DEFAULT: 'var(--mask)',
  },

  /** 滚动组件滚动条颜色 */
  scrollbar: {
    track: 'var(--scrollbar-track)',
    thumb: 'var(--scrollbar-thumb)',
  },
};

export default colorObject;
