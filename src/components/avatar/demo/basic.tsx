import React from 'react';
import { UserSolid } from '@metisjs/icons';
import { Avatar, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size={16}>
    <Space wrap size={16}>
      <Avatar size={64} icon={<UserSolid />} />
      <Avatar size="large" icon={<UserSolid />} />
      <Avatar icon={<UserSolid />} />
      <Avatar size="small" icon={<UserSolid />} />
    </Space>
    <Space wrap size={16}>
      <Avatar shape="square" size={64} icon={<UserSolid />} />
      <Avatar shape="square" size="large" icon={<UserSolid />} />
      <Avatar shape="square" icon={<UserSolid />} />
      <Avatar shape="square" size="small" icon={<UserSolid />} />
    </Space>
  </Space>
);

export default App;
