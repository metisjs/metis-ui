import React from 'react';
import { Tabs } from 'metis-ui';
import type { TabsProps } from 'metis-ui';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'My Account',
    content: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Company',
    content: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Team Members',
    content: 'Content of Tab Pane 3',
  },
];

const App: React.FC = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default App;
