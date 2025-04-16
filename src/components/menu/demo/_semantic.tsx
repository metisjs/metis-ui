import React from 'react';
import {
  CalendarOutline,
  DocumentDuplicateOutline,
  FolderOutline,
  HomeOutline,
  UsersOutline,
} from '@metisjs/icons';
import { Menu } from 'metis-ui';
import type { MenuProps } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

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
const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'sub',
        children: [
          {
            name: 'inner',
          },
          {
            name: 'icon',
          },
          {
            name: 'label',
          },
        ],
        args: [
          {
            name: 'disabled',
            type: 'boolean',
          },
          {
            name: 'active',
            type: 'boolean',
          },
          {
            name: 'childrenSelected',
            type: 'boolean',
          },
          {
            name: 'hasIcon',
            type: 'boolean',
          },
          {
            name: 'level',
            type: 'number',
          },
        ],
      },
      {
        name: 'item',
        children: [
          {
            name: 'inner',
          },
          {
            name: 'icon',
          },
          {
            name: 'label',
          },
        ],
        args: [
          {
            name: 'disabled',
            type: 'boolean',
          },
          {
            name: 'active',
            type: 'boolean',
          },
          {
            name: 'hasIcon',
            type: 'boolean',
          },
          {
            name: 'level',
            type: 'number',
          },
        ],
      },
      {
        name: 'group',
        children: [
          {
            name: 'label',
          },
          {
            name: 'list',
          },
        ],
      },
    ]}
  >
    <Menu
      openKeys={['teams', 'projects']}
      mode="inline"
      items={items}
      className="border-e-border w-72 border-e"
    />
  </SemanticPreview>
);

export default App;
