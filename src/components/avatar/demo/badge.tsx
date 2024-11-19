import React from 'react';
import { UserSolid } from '@metisjs/icons';
import { Avatar, Badge, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size={24}>
    <Badge count={1}>
      <Avatar shape="square" icon={<UserSolid />} />
    </Badge>
    <Badge dot>
      <Avatar shape="square" icon={<UserSolid />} />
    </Badge>
  </Space>
);

export default App;
