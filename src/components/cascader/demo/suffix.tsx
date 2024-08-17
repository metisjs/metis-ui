import React from 'react';
import { FaceSmileOutline } from '@metisjs/icons';
import type { CascaderProps } from 'metis-ui';
import { Cascader } from 'metis-ui';

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
  <>
    <Cascader
      className="w-72"
      suffixIcon={<FaceSmileOutline />}
      options={options}
      onChange={onChange}
      placeholder="Please select"
    />
    <br />
    <br />
    <Cascader
      className="w-72"
      suffixIcon="ab"
      options={options}
      onChange={onChange}
      placeholder="Please select"
    />
    <br />
    <br />
    <Cascader
      className="w-72"
      expandIcon={<FaceSmileOutline />}
      options={options}
      onChange={onChange}
      placeholder="Please select"
    />
    <br />
    <br />
    <Cascader
      className="w-72"
      expandIcon="ab"
      options={options}
      onChange={onChange}
      placeholder="Please select"
    />
  </>
);

export default App;
