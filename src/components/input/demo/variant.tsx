import React from 'react';
import { Input, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size={12} className="w-full">
    <Input placeholder="Outlined" />
    <Input placeholder="Filled" variant="filled" />
    <Input placeholder="Borderless" variant="borderless" />
  </Space>
);

export default App;
