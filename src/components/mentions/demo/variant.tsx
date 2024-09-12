import React from 'react';
import { Mentions, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size={12} block>
    <Mentions placeholder="Outlined" />
    <Mentions placeholder="Filled" variant="filled" />
    <Mentions placeholder="Borderless" variant="borderless" />
  </Space>
);

export default App;
