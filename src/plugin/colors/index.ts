function withOpacityValue(variable: string, fallbackColor?: string) {
  let fallbackColorValue = '';
  if (fallbackColor) {
    fallbackColorValue = `, var(${fallbackColor})`;
  }

  return `hsla(var(${variable}${fallbackColorValue}) / <alpha-value>)`;
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
};

export default colorObject;
