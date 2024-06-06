/**
 * description: 默认是移入触发菜单，可以点击鼠标右键触发。
 */
import type { MenuProps } from 'metis-ui';
import { Dropdown } from 'metis-ui';
import React from 'react';

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
      <div className="h-[200px] bg-neutral-bg-layout text-center leading-[200px] text-neutral-text-tertiary">
        Right Click on here
      </div>
    </Dropdown>
  );
};

export default App;
