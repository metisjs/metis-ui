import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button, Input, Select, Space } from 'metis-ui';
import React from 'react';

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
  <Space direction="vertical" size="middle">
    <Space.Compact>
      <Input defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '80%' }} defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact style={{ width: '100%' }}>
      <Input defaultValue="Combine input and button" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact>
      <Select defaultValue="zhejiang" options={options} className="w-40" />
      <Input defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact size="large">
      <Input
        addonBefore={<MagnifyingGlassOutline className="h-5 w-5" />}
        placeholder="large size"
      />
      <Input placeholder="another input" />
    </Space.Compact>
  </Space>
);

export default App;
