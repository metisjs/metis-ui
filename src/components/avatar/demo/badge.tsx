import React from 'react';
import { UserOutline } from '@metisjs/icons';
import { Avatar, Badge, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size={24}>
    <Badge count={1}>
      <Avatar shape="square" icon={<UserOutline />} />
    </Badge>
    <Badge dot>
      <Avatar shape="square" icon={<UserOutline />} />
    </Badge>
  </Space>
);

export default App;
