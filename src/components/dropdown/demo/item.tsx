import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';
import React from 'react';

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '0',
  },
  {
    label: '2nd menu item',
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item（disabled）',
    key: '3',
    disabled: true,
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <ChevronDownOutline className="h-5 w-5" />
      </Space>
    </a>
  </Dropdown>
);

export default App;
