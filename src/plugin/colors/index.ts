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
  'primary-content': withOpacityValue('--primary-content'),

  secondary: withOpacityValue('--secondary'),
  'secondary-active': withOpacityValue('--secondary-active', '--secondary'),

  accent: withOpacityValue('--accent'),
  'accent-active': withOpacityValue('--accent-active', '--accent'),
};

export default colorObject;
