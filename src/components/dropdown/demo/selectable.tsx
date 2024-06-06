/**
 * description: 添加 `menu` 中的 `selectable` 属性可以开启选择能力。
 */
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'meta-ui';
import { Dropdown, Space } from 'meta-ui';
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
