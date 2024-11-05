import React from 'react';
import { Tabs } from 'metis-ui';

const App: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: 'My Account',
        key: '1',
        content: 'My Account',
      },
      {
        label: 'Company',
        key: '2',
        content: 'Company',
        disabled: true,
      },
      {
        label: 'Team Members',
        key: '3',
        content: 'Team Members',
      },
    ]}
  />
);

export default App;
