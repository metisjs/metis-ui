import React from 'react';
import { Divider, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space split={<Divider type="vertical" />}>
    <a>Link</a>
    <a>Link</a>
    <a>Link</a>
  </Space>
);

export default App;
