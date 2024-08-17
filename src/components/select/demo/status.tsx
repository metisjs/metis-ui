import React from 'react';
import { Select, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical block>
    <Select options={[]} status="error" style={{ width: '100%' }} />
    <Select options={[]} status="warning" style={{ width: '100%' }} />
  </Space>
);

export default App;
