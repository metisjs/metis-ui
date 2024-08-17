import React from 'react';
import type { MenuProps } from 'metis-ui';
import { Dropdown } from 'metis-ui';

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => {
  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <div className="h-[200px] bg-layout text-center leading-[200px] text-text-tertiary">
        Right Click on here
      </div>
    </Dropdown>
  );
};

export default App;
