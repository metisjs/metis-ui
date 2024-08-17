import React from 'react';
import { Avatar, Badge, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="middle">
    <Badge size="default" count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge size="small" count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge dot size="default">
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge dot size="small">
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
