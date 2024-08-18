import React, { useState } from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import { clsx, ColorPicker, Space } from 'metis-ui';

const Demo = () => {
  const [open, setOpen] = useState(false);
  return (
    <Space vertical>
      <ColorPicker defaultValue="#4f46e5" showText allowClear />
      <ColorPicker
        defaultValue="#4f46e5"
        showText={(color) => <span>Custom Text ({color.toHexString()})</span>}
      />
      <ColorPicker
        defaultValue="#4f46e5"
        open={open}
        onOpenChange={setOpen}
        showText={() => (
          <ChevronDownOutline className={clsx('text-text-tertiary')} rotate={open ? 180 : 0} />
        )}
      />
    </Space>
  );
};

export default Demo;
