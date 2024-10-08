import React from 'react';
import type { PaginationProps } from 'metis-ui';
import { Pagination, Space } from 'metis-ui';

const onChange: PaginationProps['onChange'] = (pageNumber) => {
  console.log('Page: ', pageNumber);
};

const App: React.FC = () => (
  <Space vertical>
    <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
    <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} disabled />
  </Space>
);

export default App;
