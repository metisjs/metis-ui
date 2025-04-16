import React from 'react';
import { Select, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical block>
    <Select options={[]} status="error" className="w-full" />
    <Select options={[]} status="warning" className="w-full" />
  </Space>
);

export default App;
