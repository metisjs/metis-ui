import React from 'react';
import { InformationCircleOutline, UsersSolid } from '@metisjs/icons';
import { Input, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical className="flex">
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
