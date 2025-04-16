import React from 'react';
import { BuildingOfficeSolid, UserGroupSolid, UserSolid } from '@metisjs/icons';
import type { TabsProps } from 'metis-ui';
import { Tabs } from 'metis-ui';

const items: TabsProps['items'] = [
  {
    key: '1',
    icon: <UserSolid />,
    label: 'My Account',
    content: (
      <>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
      </>
    ),
  },
  {
    key: '2',
    icon: <BuildingOfficeSolid />,
    label: 'Company',
    content: (
      <>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </>
    ),
  },
  {
    key: '3',
    icon: <UserGroupSolid />,
    label: 'Team Members',
    content: (
      <>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </>
    ),
  },
];

const App: React.FC = () => (
  <Tabs
    type="card"
    items={items}
    className={{
      root: '[--card-active-background-color:var(--color-gray-950)]',
      panel: 'p-4',
    }}
  />
);

export default App;
