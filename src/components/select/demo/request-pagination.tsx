import { Select } from 'metis-ui';
import React from 'react';
import { fetchDataWithPagination } from './services';

export default () => (
  <Select
    showSearch
    placeholder="Search to Select"
    request={fetchDataWithPagination}
    fieldNames={{ label: 'name', value: 'id' }}
    pagination
    onChange={(...arg) => console.log(...arg)}
    className="w-[320px]"
  />
);
