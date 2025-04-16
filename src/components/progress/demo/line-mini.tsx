import React from 'react';
import { Progress, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size="small" className="w-45">
    <Progress percent={30} size="small" />
    <Progress percent={50} size="small" status="active" />
    <Progress percent={70} size="small" status="exception" />
    <Progress percent={100} size="small" />
  </Space>
);

export default App;
