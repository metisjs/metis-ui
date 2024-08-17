import React from 'react';
import { Breadcrumb } from 'metis-ui';

const menuItems = [
  {
    key: '1',
    label: 'General',
    href: '',
  },
  {
    key: '2',
    label: 'Layout',
    href: '',
  },
  {
    key: '3',
    label: 'Navigation',
    href: '',
  },
];

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        title: 'Ant Design',
      },
      {
        title: 'Component',
        href: '',
      },
      {
        title: 'General',
        href: '',
        menu: { items: menuItems },
      },
      {
        title: 'Button',
      },
    ]}
  />
);

export default App;
