import React from 'react';
import { ColorPicker } from 'metis-ui';

export default () => {
  const [color, setColor] = React.useState<string>('#4f46e5');

  return (
    <ColorPicker
      value={color}
      allowClear
      onChange={(c) => {
        setColor(c.toHexString());
      }}
    />
  );
};
