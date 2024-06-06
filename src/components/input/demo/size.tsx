/**
 * description: 我们为 `<Input />` 输入框定义了三种尺寸（大、默认、小）。
 */
import { UsersSolid } from '@metisjs/icons';
import { Input, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <Input size="large" placeholder="large size" prefix={<UsersSolid />} />
    <Input placeholder="default size" prefix={<UsersSolid />} />
    <Input size="small" placeholder="small size" prefix={<UsersSolid />} />
  </Space>
);

export default App;
