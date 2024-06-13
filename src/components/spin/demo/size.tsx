import { Space, Spin } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space size={16}>
    <Spin size="small" />
    <Spin />
    <Spin size="large" />
  </Space>
);

export default App;
