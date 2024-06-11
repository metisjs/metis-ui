/**
 * description: 共有四种样式 `success`、`info`、`warning`、`error`。
 */
import { Alert, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Alert message="Success Text" type="success" />
    <Alert message="Info Text" type="info" />
    <Alert message="Warning Text" type="warning" />
    <Alert message="Error Text" type="error" />
  </Space>
);

export default App;
