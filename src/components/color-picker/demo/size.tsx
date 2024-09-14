import React from 'react';
import { ColorPicker, Space } from 'metis-ui';

const Demo = () => (
  <Space>
    <Space vertical>
      <ColorPicker defaultValue="#4f46e5" size="mini" />
      <ColorPicker defaultValue="#4f46e5" size="small" />
      <ColorPicker defaultValue="#4f46e5" />
      <ColorPicker defaultValue="#4f46e5" size="large" />
    </Space>
    <Space vertical>
      <ColorPicker defaultValue="#4f46e5" size="mini" showText />
      <ColorPicker defaultValue="#4f46e5" size="small" showText />
      <ColorPicker defaultValue="#4f46e5" showText />
      <ColorPicker defaultValue="#4f46e5" size="large" showText />
    </Space>
  </Space>
);

export default Demo;
