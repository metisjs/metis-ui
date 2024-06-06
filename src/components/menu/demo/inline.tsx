/**
 * description: 垂直菜单，子菜单内嵌在菜单区域。
 */
import {
  CalendarOutline,
  DocumentDuplicateOutline,
  FolderOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Menu } from 'metis-ui';
import React from 'react';

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
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 288 }}
      defaultSelectedKeys={['dashboard']}
      defaultOpenKeys={['teams', 'projects']}
      mode="inline"
      items={items}
      className="border-e border-e-neutral-border"
    />
  );
};

export default App;
