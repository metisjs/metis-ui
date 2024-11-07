import React from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Button, Divider, Dropdown, Space } from 'metis-ui';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item (disabled)',
    disabled: true,
  },
  {
    key: '3',
    label: '3rd menu item (disabled)',
    disabled: true,
  },
];

const App: React.FC = () => {
  return (
    <Dropdown
      menu={{ items }}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: 0 }} />
          <Space style={{ padding: 8 }}>
            <Button type="primary" size="small">
              Click me!
            </Button>
          </Space>
        </>
      )}
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
