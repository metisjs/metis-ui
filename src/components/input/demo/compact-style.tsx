import React from 'react';
import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button, Input, Select, Space } from 'metis-ui';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
  },
];

const App: React.FC = () => (
  <Space vertical size="middle">
    <Space.Compact>
      <Input defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact>
      <Input className="w-1/5" defaultValue="0571" />
      <Input className="w-4/5" defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact className="w-full">
      <Input defaultValue="Combine input and button" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact>
      <Select defaultValue="zhejiang" options={options} className="w-40" />
      <Input defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact size="large">
      <Input addonBefore={<MagnifyingGlassOutline className="size-5" />} placeholder="large size" />
      <Input placeholder="another input" />
    </Space.Compact>
  </Space>
);

export default App;
