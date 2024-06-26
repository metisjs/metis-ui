import type { PaginationProps } from 'metis-ui';
import { Pagination } from 'metis-ui';
import React from 'react';

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return 'Previous';
  }
  if (type === 'next') {
    return 'Next';
  }
  return originalElement;
};

const App: React.FC = () => <Pagination total={500} itemRender={itemRender} />;

export default App;
