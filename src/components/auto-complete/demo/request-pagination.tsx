import React from 'react';
import { AutoComplete } from 'metis-ui';
import { fetchDataWithPagination } from '../../select/demo/services';

export default () => (
  <AutoComplete
    placeholder="input here"
    request={fetchDataWithPagination}
    fieldNames={{ label: 'name', value: 'name' }}
    optionFilterProp="name"
    lazyLoad
    onChange={(...arg) => console.log(...arg)}
    className="w-[320px]"
  />
);
