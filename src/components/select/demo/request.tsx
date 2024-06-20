import { Select } from 'metis-ui';
import React from 'react';
import { fetchData } from './services';

export default () => (
  <Select
    showSearch
    placeholder="Search to Select"
    request={fetchData}
    fieldNames={{ label: 'name', value: 'id' }}
    optionFilterProp="name"
    onChange={(...arg) => console.log(...arg)}
    className="w-[320px]"
  />
);
