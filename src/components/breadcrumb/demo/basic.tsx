import { Breadcrumb } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        title: 'Home',
      },
      {
        title: 'Application Center',
        path: '/a',
      },
      {
        title: 'Application List',
        path: '/b',
      },
      {
        title: 'An Application',
      },
    ]}
  />
);

export default App;
