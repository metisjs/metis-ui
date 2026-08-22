import React from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'item',
  },
  {
    key: 'sub',
    label: 'subitem',
    children: [
      {
        key: 'sub-1',
        label: 'item',
      },
      {
        key: 'sub-sub',
        label: 'subitem',
        children: [
          {
            key: 'sub-sub-1',
            label: 'item',
          },
          {
            key: 'sub-sub-2',
            label: 'item',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <ChevronDownOutline className="size-4" />
      </Space>
    </a>
  </Dropdown>
);

export default App;
