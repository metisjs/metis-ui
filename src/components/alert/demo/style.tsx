import React from 'react';
import { Alert, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical block>
    <Alert message="Success Text" type="success" />
    <Alert message="Info Text" type="info" />
    <Alert message="Warning Text" type="warning" />
    <Alert message="Error Text" type="error" />
  </Space>
);

export default App;
