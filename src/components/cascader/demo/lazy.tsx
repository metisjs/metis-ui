import type { CascaderProps } from 'metis-ui';
import { Cascader } from 'metis-ui';
import React, { useState } from 'react';

interface Option {
  value?: string | number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

const optionLists: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
];

const App: React.FC = () => {
  const [options] = useState<Option[]>(optionLists);

  const onChange: CascaderProps<Option>['onChange'] = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  return <Cascader className="w-72" options={options} onChange={onChange} changeOnSelect />;
};

export default App;
