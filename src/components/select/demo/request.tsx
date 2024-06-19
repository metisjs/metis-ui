import { Select } from 'metis-ui';
import React from 'react';
import { fetchData } from './services';

export default () => (
  <Select
    showSearch
    request={fetchData}
    fieldNames={{ label: 'name', value: 'id' }}
    onChange={(...arg) => console.log(...arg)}
    optionFilterProp="name"
    className="w-[320px]"
  />
);
