import React, { useState } from 'react';
import {
  CalendarOutline,
  ChevronDoubleLeftOutline,
  ChevronDoubleRightOutline,
  DocumentDuplicateOutline,
  FolderOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Button, Menu } from 'metis-ui';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Dashboard', 'dashboard', <HomeOutline />),

  getItem('Teams', 'teams', <UsersOutline />, [getItem('Option 1', '1'), getItem('Option 2', '2')]),

  getItem('Projects', 'projects', <FolderOutline />, [
    getItem('Item 1', 'g1', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 5', '5'), getItem('Option 6', '6')], 'group'),
  ]),

  getItem('Calendar', '7', <CalendarOutline />),
  getItem('Documents', '8', <DocumentDuplicateOutline />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="w-72">
      <Button
        type="primary"
        onClick={toggleCollapsed}
        className="mb-4"
        icon={collapsed ? <ChevronDoubleRightOutline /> : <ChevronDoubleLeftOutline />}
      ></Button>
      <Menu
        defaultSelectedKeys={['dashboard']}
        defaultOpenKeys={['teams', 'projects']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default App;
