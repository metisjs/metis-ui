import { Segmented, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical>
    <Segmented size="large" options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
    <Segmented options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
    <Segmented size="small" options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
  </Space>
);

export default App;
