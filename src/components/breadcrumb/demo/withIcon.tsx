import { HomeOutline, UserOutline } from '@metisjs/icons';
import { Breadcrumb, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        href: '',
        title: <HomeOutline className="h-4 w-4" />,
      },
      {
        href: '',
        title: (
          <Space size={4}>
            <UserOutline className="h-4 w-4" />
            <span>Application List</span>
          </Space>
        ),
      },
      {
        title: 'Application',
      },
    ]}
  />
);

export default App;
