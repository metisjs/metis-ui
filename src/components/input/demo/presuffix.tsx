/**
 * description: 在输入框上添加前缀或后缀图标。
 */
import { InformationCircleOutline, UsersSolid } from '@metaoa/icons';
import { Input, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <Input
      placeholder="Enter your username"
      prefix={<UsersSolid />}
      suffix={<InformationCircleOutline />}
    />
    <Input prefix="￥" suffix="RMB" />
    <Input prefix="￥" suffix="RMB" disabled />
  </Space>
);

export default App;
