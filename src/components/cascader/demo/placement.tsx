import React, { useState } from 'react';
import { Cascader, Segmented } from 'metis-ui';
import type { SelectCommonPlacement } from 'metis-ui/es/select/interface';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [placement, setPlacement] = useState<SelectCommonPlacement>('topLeft');

  const placementChange = (value: string) => {
    setPlacement(value as SelectCommonPlacement);
  };

  return (
    <>
      <Segmented
        value={placement}
        options={[
          { label: 'topLeft', value: 'topLeft' },
          { label: 'topRight', value: 'topRight' },
          { label: 'bottomLeft', value: 'bottomLeft' },
          { label: 'bottomRight', value: 'bottomRight' },
        ]}
        onChange={placementChange}
      />
      <br />
      <br />
      <Cascader
        className="w-72"
        options={options}
        placeholder="Please select"
        placement={placement}
      />
    </>
  );
};

export default App;
