/**
 * description: 用于页面和区块的加载中状态。
 */
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
