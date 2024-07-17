import { InputNumber, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical size={12}>
    <InputNumber placeholder="Outlined" className="w-52" />
    <InputNumber placeholder="Filled" variant="filled" className="w-52" />
    <InputNumber placeholder="Borderless" variant="borderless" className="w-52" />
  </Space>
);

export default App;
