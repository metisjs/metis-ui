import React from 'react';
import { Space, Transfer } from 'metis-ui';

const App: React.FC = () => (
  <Space size="middle" vertical block>
    <Transfer status="error" />
    <Transfer status="warning" showSearch />
  </Space>
);

export default App;
