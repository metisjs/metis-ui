import { Progress, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical size="small" style={{ width: 180 }}>
    <Progress percent={30} size="small" />
    <Progress percent={50} size="small" status="active" />
    <Progress percent={70} size="small" status="exception" />
    <Progress percent={100} size="small" />
  </Space>
);

export default App;
