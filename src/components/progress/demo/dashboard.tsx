import { Progress, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space size="small" wrap block>
    <Progress type="dashboard" percent={75} />
    <Progress type="dashboard" percent={75} gapDegree={30} />
  </Space>
);

export default App;
