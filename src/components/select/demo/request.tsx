import React from 'react';
import { Select } from 'metis-ui';
import { fetchData } from './services';

export default () => (
  <Select
    showSearch
    placeholder="Search to Select"
    request={fetchData}
    fieldNames={{ label: 'name', value: 'id' }}
    onChange={(...arg) => console.log(...arg)}
    className="w-[320px]"
  />
);
