/**
 * description: 水平的顶部导航菜单。
 */
import {
  AdjustmentsHorizontalOutline,
  ChatBubbleBottomCenterOutline,
  ComputerDesktopOutline,
} from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Menu } from 'metis-ui';
import React, { useState } from 'react';

const items: MenuProps['items'] = [
  {
    label: 'Navigation One',
    key: 'computer',
    icon: <ComputerDesktopOutline />,
  },
  {
    label: 'Navigation Two',
    key: 'chat',
    icon: <ChatBubbleBottomCenterOutline />,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <AdjustmentsHorizontalOutline />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
  {
    label: 'Navigation Four',
    key: 'four',
  },
];

const App: React.FC = () => {
  const [current, setCurrent] = useState('computer');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      className="shadow"
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default App;
