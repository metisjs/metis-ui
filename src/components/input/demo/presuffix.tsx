import { InformationCircleOutline, UsersSolid } from '@metaoa/icons';
import { Input, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <Input
      placeholder="Enter your username"
      prefix={<UsersSolid className="site-form-item-icon" />}
      suffix={<InformationCircleOutline style={{ color: 'rgba(0,0,0,.45)' }} />}
    />
    <Input prefix="￥" suffix="RMB" />
    <Input prefix="￥" suffix="RMB" disabled />
  </Space>
);

export default App;
