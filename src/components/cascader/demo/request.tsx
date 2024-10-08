import React from 'react';
import { Cascader } from 'metis-ui';
import { fetchData } from './services';

export default () => (
  <Cascader
    showSearch
    placeholder="Search to Select"
    request={fetchData}
    fieldNames={{ label: 'name', value: 'id' }}
    onChange={(...arg) => console.log(...arg)}
    className="w-72"
  />
);
