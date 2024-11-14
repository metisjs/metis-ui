import React from 'react';
import { HomeOutline, UserOutline } from '@metisjs/icons';
import { Breadcrumb } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'item', children: [{ name: 'icon' }] },
      { name: 'separator' },
    ]}
  >
    <Breadcrumb
      items={[
        {
          href: '',
          icon: <HomeOutline />,
          title: 'Home',
        },
        {
          href: '',
          icon: <UserOutline />,
          title: 'Users',
        },
        {
          title: 'Application',
        },
      ]}
    />
  </SemanticPreview>
);

export default App;
