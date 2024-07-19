import { AutoComplete } from 'metis-ui';
import React from 'react';
import { fetchData } from '../../select/demo/services';

export default () => (
  <AutoComplete
    placeholder="input here"
    request={fetchData}
    fieldNames={{ label: 'name', value: 'name' }}
    optionFilterProp="name"
    onChange={(...arg) => console.log(...arg)}
    className="w-[320px]"
  />
);
