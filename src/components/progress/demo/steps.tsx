import React from 'react';
import { Progress, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="small" vertical block>
    <Progress percent={50} steps={3} />
    <Progress percent={30} steps={5} />
    <Progress percent={100} steps={5} size="small" strokeColor="#22c55e" />
    <Progress percent={60} steps={5} strokeColor={['#22c55e', '#22c55e', '#ef4444']} />
  </Space>
);

export default App;
