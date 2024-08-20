import React from 'react';
import { upperFirst } from 'lodash';
import { ColorPicker, useTheme } from 'metis-ui';
import twColors from 'tailwindcss/colors';

const colors = ['amber', 'lime', 'teal', 'sky', 'indigo', 'rose'];

const Demo: React.FC = () => {
  const theme = useTheme();

  const presets = colors.map((color) => ({
    label: upperFirst(color),
    colors: Object.values(twColors[color as keyof typeof twColors]),
  }));

  return <ColorPicker presets={presets} defaultValue={theme.primary} />;
};

export default Demo;
