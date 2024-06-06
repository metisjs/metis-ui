/**
 * description: 默认是点击关闭菜单，可以关闭此功能。
 */
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'meta-ui';
import { Dropdown, Space } from 'meta-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '3') {
      setOpen(false);
    }
  };

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  const items: MenuProps['items'] = [
    {
      label: 'Clicking me will not close the menu.',
      key: '1',
    },
    {
      label: 'Clicking me will not close the menu also.',
      key: '2',
    },
    {
      label: 'Clicking me will close the menu.',
      key: '3',
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Hover me
          <ChevronDownOutline className="h-5 w-5" />
        </Space>
      </a>
    </Dropdown>
  );
};

export default App;
