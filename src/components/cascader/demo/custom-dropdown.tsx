import React from 'react';
import { Cascader, Divider } from 'metis-ui';

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

const popupRender = (menus: React.ReactNode) => (
  <div>
    {menus}
    <Divider className="m-0" />
    <div className="p-2">The footer is not very short.</div>
  </div>
);

const App: React.FC = () => (
  <Cascader
    className="w-72"
    options={options}
    popupRender={popupRender}
    placeholder="Please select"
  />
);

export default App;
