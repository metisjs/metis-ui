import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';
import React from 'react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Item 1',
  },
  {
    key: '2',
    label: 'Item 2',
  },
  {
    key: '3',
    label: 'Item 3',
  },
];

const App: React.FC = () => (
  <Dropdown
    menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }}
  >
    <Space>
      Selectable
      <ChevronDownOutline className="h-5 w-5" />
    </Space>
  </Dropdown>
);

export default App;
