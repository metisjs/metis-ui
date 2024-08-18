import React, { useMemo, useState } from 'react';
import { Button, ColorPicker } from 'metis-ui';
import type { ColorPickerProps, GetProp } from 'metis-ui';

type Color = Extract<GetProp<ColorPickerProps, 'value'>, string | { cleared: any }>;

const Demo: React.FC = () => {
  const [color, setColor] = useState<Color>('#4f46e5');

  const bgColor = useMemo<string>(
    () => (typeof color === 'string' ? color : color!.toHexString()),
    [color],
  );

  const btnStyle: React.CSSProperties = {
    backgroundColor: bgColor,
  };

  return (
    <ColorPicker value={color} onChange={setColor}>
      <Button type="primary" style={btnStyle}>
        open
      </Button>
    </ColorPicker>
  );
};

export default Demo;
