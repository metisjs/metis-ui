import { UsersSolid } from '@metisjs/icons';
import { Input, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical className="flex">
    <Input size="large" placeholder="large size" prefix={<UsersSolid />} />
    <Input placeholder="default size" prefix={<UsersSolid />} />
    <Input size="small" placeholder="small size" prefix={<UsersSolid />} />
  </Space>
);

export default App;
