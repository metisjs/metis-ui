import React from 'react';
import { Progress, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size="middle" block>
    <Space vertical size="small" style={{ width: 300 }}>
      <Progress percent={50} />
      <Progress percent={50} size="small" />
      <Progress percent={50} size={[300, 20]} />
    </Space>
    <Space align="center" wrap size={30} block>
      <Progress type="circle" percent={50} />
      <Progress type="circle" percent={50} size="small" />
      <Progress type="circle" percent={50} size={20} />
    </Space>
    <Space align="center" wrap size={30} block>
      <Progress type="dashboard" percent={50} />
      <Progress type="dashboard" percent={50} size="small" />
      <Progress type="dashboard" percent={50} size={20} />
    </Space>
    <Space align="center" wrap size={30} block>
      <Progress steps={3} percent={50} />
      <Progress steps={3} percent={50} size="small" />
      <Progress steps={3} percent={50} size={20} />
      <Progress steps={3} percent={50} size={[20, 30]} />
    </Space>
  </Space>
);

export default App;
