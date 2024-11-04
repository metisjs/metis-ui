import React from 'react';
import { Tabs } from 'metis-ui';

const App: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: 'My Account',
        key: '1',
        children: 'My Account',
      },
      {
        label: 'Company',
        key: '2',
        children: 'Company',
        disabled: true,
      },
      {
        label: 'Team Members',
        key: '3',
        children: 'Team Members',
      },
    ]}
  />
);

export default App;
