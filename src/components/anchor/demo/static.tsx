import { Anchor } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Anchor
    affix={false}
    items={[
      {
        key: '1',
        href: '#src-components-anchor-demo-basic',
        title: 'Basic demo',
      },
      {
        key: '2',
        href: '#src-components-anchor-demo-static',
        title: 'Static demo',
      },
      {
        key: '3',
        href: '#api',
        title: 'API',
        children: [
          {
            key: '4',
            href: '#anchor-props',
            title: 'Anchor Props',
          },
          {
            key: '5',
            href: '#link-props',
            title: 'Link Props',
          },
        ],
      },
    ]}
  />
);

export default App;
