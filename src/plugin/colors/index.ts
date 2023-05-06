function withOpacityValue(variable: string, fallbackColor?: string) {
  let fallbackColorValue = '';
  if (fallbackColor) {
    fallbackColorValue = `, var(${fallbackColor})`;
  }

  return `hsl(var(${variable}${fallbackColorValue}) / <alpha-value>)`;
}

const colorObject = {
  transparent: 'transparent',
  current: 'currentColor',

  primary: withOpacityValue('--primary'),
  'primary-active': withOpacityValue('--primary-active', '--primary'),
  'primary-bg': withOpacityValue('--primary-bg'),

  secondary: withOpacityValue('--secondary'),
  'secondary-active': withOpacityValue('--secondary-active', '--secondary'),
  'secondary-bg': withOpacityValue('--secondary-bg'),

  accent: withOpacityValue('--accent'),
  'accent-active': withOpacityValue('--accent-active', '--accent'),
  'accent-bg': withOpacityValue('--accent-bg'),

  info: withOpacityValue('--info'),
  'info-bg': withOpacityValue('--inc', '--nc'),

  success: withOpacityValue('--su'),
  'success-bg': withOpacityValue('--suc', '--nc'),

  warning: withOpacityValue('--wa'),
  'warning-bg': withOpacityValue('--wac', '--nc'),

  error: withOpacityValue('--error'),
  'error-bg': withOpacityValue('--error', '--nc'),
};

export default colorObject;
