import React from 'react';
import { BuildingOfficeSolid, UserGroupSolid, UserSolid } from '@metisjs/icons';
import type { TabsProps } from 'metis-ui';
import { Tabs } from 'metis-ui';

const items: TabsProps['items'] = [
  {
    key: '1',
    icon: <UserSolid />,
    label: 'My Account',
    content: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    icon: <BuildingOfficeSolid />,
    label: 'Company',
    content: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    icon: <UserGroupSolid />,
    label: 'Team Members',
    content: 'Content of Tab Pane 3',
  },
];

const App: React.FC = () => <Tabs defaultActiveKey="2" items={items} />;

export default App;
