/**
 * description: 点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。
 */
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';
import React from 'react';

const onClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Click on item ${key}`);
};

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items, onClick }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me, Click menu item
        <ChevronDownOutline className="h-5 w-5" />
      </Space>
    </a>
  </Dropdown>
);

export default App;
