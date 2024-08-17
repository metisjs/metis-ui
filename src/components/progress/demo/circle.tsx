import React from 'react';
import { Progress, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="small" wrap block>
    <Progress type="circle" percent={75} />
    <Progress type="circle" percent={70} status="exception" />
    <Progress type="circle" percent={100} />
  </Space>
);

export default App;
