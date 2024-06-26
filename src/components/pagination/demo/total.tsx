import { Pagination, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical">
    <Pagination
      total={85}
      showTotal={(total) => `Total ${total} items`}
      defaultPageSize={20}
      defaultCurrent={1}
    />
    <Pagination
      total={85}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      defaultPageSize={20}
      defaultCurrent={1}
    />
  </Space>
);

export default App;
