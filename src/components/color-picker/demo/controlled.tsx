import React, { useState } from 'react';
import { ColorPicker } from 'metis-ui';
import type { ColorPickerProps, GetProp } from 'metis-ui';

type Color = GetProp<ColorPickerProps, 'value'>;

const Demo: React.FC = () => {
  const [color, setColor] = useState<Color>('#4f46e5');
  return <ColorPicker value={color} onChange={setColor} />;
};

export default Demo;
