import { Cascader, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical block>
    <Cascader status="error" placeholder="Error" />
    <Cascader status="warning" multiple placeholder="Warning multiple" />
  </Space>
);

export default App;
