/**
 * description: 使用 `status` 为 Select 添加状态，可选 `error` 或者 `warning`。
 */
import { Select, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Select status="error" style={{ width: '100%' }} />
    <Select status="warning" style={{ width: '100%' }} />
  </Space>
);

export default App;
