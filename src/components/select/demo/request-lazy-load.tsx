import React from 'react';
import { Select } from 'metis-ui';
import { fetchDataWithPagination } from './services';

export default () => (
  <Select
    showSearch
    placeholder="Search to Select"
    defaultValue={{
      id: 50,
      name: `TradeCode 50`,
    }}
    request={fetchDataWithPagination}
    fieldNames={{ label: 'name', value: 'id' }}
    lazyLoad
    onChange={(...arg) => console.log(...arg)}
    className="w-[320px]"
  />
);
