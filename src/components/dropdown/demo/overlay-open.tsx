import React, { useState } from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';

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
          <ChevronDownOutline className="size-4" />
        </Space>
      </a>
    </Dropdown>
  );
};

export default App;
