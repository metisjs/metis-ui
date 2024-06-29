import { Avatar, Badge, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space size="large">
    <Badge count={5} title="Custom hover text">
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={-5} title="Negative">
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
