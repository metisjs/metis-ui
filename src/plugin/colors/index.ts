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

  primary: {
    DEFAULT: withOpacityValue('--primary'),
    foreground: withOpacityValue('--primary-foreground'),
    accent: withOpacityValue('--primary-accent'),
    soft: withOpacityValue('--primary-soft'),
  },
  secondary: {
    DEFAULT: withOpacityValue('--secondary'),
    foreground: withOpacityValue('--secondary-foreground'),
    accent: withOpacityValue('--secondary-accent'),
    soft: withOpacityValue('--secondary-soft'),
  },
};

export default colorObject;
