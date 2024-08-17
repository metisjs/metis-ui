import React from 'react';
import { HomeOutline, UserOutline } from '@metisjs/icons';
import { Breadcrumb } from 'metis-ui';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        href: '',
        icon: <HomeOutline />,
      },
      {
        href: '',
        icon: <UserOutline />,
        title: 'Application List',
      },
      {
        title: 'Application',
      },
    ]}
  />
);

export default App;
