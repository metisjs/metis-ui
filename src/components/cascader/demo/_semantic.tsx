import React from 'react';
import { Cascader, clsx } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

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

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'arrow' },
      { name: 'clear' },
      {
        name: 'selector',
        children: [
          {
            name: 'search',
          },
          {
            name: 'item',
          },
          {
            name: 'placeholder',
          },
          {
            name: 'input',
          },
        ],
      },
      { name: 'popup' },
      { name: 'column' },
      {
        name: 'option',
        children: [
          {
            name: 'checkbox',
          },
          {
            name: 'label',
          },
          {
            name: 'icon',
          },
        ],
        args: [
          {
            name: 'selected',
            type: 'boolean',
          },
          {
            name: 'active',
            type: 'boolean',
          },
          {
            name: 'disabled',
            type: 'boolean',
          },
        ],
      },
    ]}
    rootArgs={[
      { name: 'open', type: 'boolean' },
      { name: 'disabled', type: 'boolean' },
    ]}
  >
    {(hover) => {
      const multi = ['selector_item', 'option_checkbox'].includes(hover?.path ?? '');
      const showSearch = hover?.path === 'selector_search';
      const value = multi
        ? [['zhejiang', 'hangzhou', 'xihu']]
        : hover?.path === 'selector_placeholder'
          ? undefined
          : ['zhejiang', 'hangzhou', 'xihu'];

      return (
        <Cascader
          allowClear
          multiple={multi}
          showSearch={showSearch}
          value={value as any}
          className={{
            root: 'w-72',
            clear: clsx({
              'opacity-100': hover?.path === 'clear',
            }),
          }}
          options={options}
          placeholder="Please select"
          open
          getPopupContainer={(node) => node.parentNode}
        />
      );
    }}
  </SemanticPreview>
);

export default App;
