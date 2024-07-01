import { Pagination, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical>
    <Pagination simple defaultCurrent={2} total={50} />
    <Pagination disabled simple defaultCurrent={2} total={50} />
  </Space>
);

export default App;
