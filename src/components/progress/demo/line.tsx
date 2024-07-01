import { Progress, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space size="small" vertical block>
    <Progress percent={30} />
    <Progress percent={50} status="active" />
    <Progress percent={70} status="exception" />
    <Progress percent={100} />
    <Progress percent={50} showInfo={false} />
  </Space>
);

export default App;
