import React from 'react';
import type { CascaderProps } from 'metis-ui';
import { Cascader, Space } from 'metis-ui';

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

const onChange: CascaderProps<Option>['onChange'] = (value) => {
  console.log(value);
};

const App: React.FC = () => (
  <Space vertical>
    <Cascader
      className="w-72"
      defaultValue={['zhejiang', 'hangzhou', 'xihu']}
      options={options}
      onChange={onChange}
    />
    <Cascader
      className="w-72"
      defaultValue={[
        {
          value: 'jiangsu',
          label: 'Jiangsu',
        },
        { value: 'nanjing', label: 'Nanjing' },
        {
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
        },
      ]}
      options={options}
      onChange={onChange}
    />
  </Space>
);

export default App;
