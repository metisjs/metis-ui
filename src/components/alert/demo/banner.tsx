import React from 'react';
import { Alert, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical block>
    <Alert message="Warning text" banner />
    <Alert
      message="Very long warning text warning text text text text text text text"
      banner
      closable
    />
    <Alert showIcon={false} message="Warning text without icon" banner />
    <Alert type="error" message="Error text" banner />
  </Space>
);

export default App;
