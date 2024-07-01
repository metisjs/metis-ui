import { Progress, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space wrap size="small" block>
    <Progress type="circle" percent={30} size={80} />
    <Progress type="circle" percent={70} size={80} status="exception" />
    <Progress type="circle" percent={100} size={80} />
  </Space>
);

export default App;
