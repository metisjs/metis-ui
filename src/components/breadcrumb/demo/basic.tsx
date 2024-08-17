import React from 'react';
import { Breadcrumb } from 'metis-ui';

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
