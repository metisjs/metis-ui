import { Progress, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical size="small" block>
    <Progress strokeLinecap="butt" percent={75} />
    <Space wrap size="small" block>
      <Progress strokeLinecap="butt" type="circle" percent={75} />
      <Progress strokeLinecap="butt" type="dashboard" percent={75} />
    </Space>
  </Space>
);

export default App;
