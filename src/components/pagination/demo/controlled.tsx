import React, { useState } from 'react';
import type { PaginationProps } from 'metis-ui';
import { Pagination } from 'metis-ui';

const App: React.FC = () => {
  const [current, setCurrent] = useState(3);

  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setCurrent(page);
  };

  return <Pagination current={current} onChange={onChange} total={50} />;
};

export default App;
