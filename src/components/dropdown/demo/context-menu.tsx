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
      <div className="text-text-tertiary h-[200px] bg-gray-100 text-center leading-[200px] dark:bg-white/10">
        Right Click on here
      </div>
    </Dropdown>
  );
};

export default App;
