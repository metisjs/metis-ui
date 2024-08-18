import React from 'react';
import { upperFirst } from 'lodash';
import { ColorPicker, useTheme } from 'metis-ui';
import twColors from 'tailwindcss/colors';

const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

const Demo: React.FC = () => {
  const theme = useTheme();

  const presets = colors.map((color) => ({
    label: upperFirst(color),
    colors: Object.values(twColors[color as keyof typeof twColors]),
  }));

  return <ColorPicker presets={presets} defaultValue={theme.primary} />;
};

export default Demo;
