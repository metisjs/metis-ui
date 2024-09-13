import React from 'react';
import { Rate, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="middle" vertical>
    <Space size="middle">
      <Rate defaultValue={3} />
      <span>allowClear: true</span>
    </Space>
    <Space size="middle">
      <Rate defaultValue={3} allowClear={false} />
      <span>allowClear: false</span>
    </Space>
  </Space>
);

export default App;
