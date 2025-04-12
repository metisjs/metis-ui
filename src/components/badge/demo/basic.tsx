import React from 'react';
import { ClockOutline } from '@metisjs/icons';
import { Avatar, Badge, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="middle">
    <Badge count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={0} showZero>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={<ClockOutline className="text-error size-5" />}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
