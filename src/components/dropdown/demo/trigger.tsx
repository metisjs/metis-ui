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
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }} trigger={['click']}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Click me
        <ChevronDownOutline className="h-5 w-5" />
      </Space>
    </a>
  </Dropdown>
);

export default App;
