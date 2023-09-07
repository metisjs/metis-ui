/**
 * description: 使用 `dropdownRender` 对下拉菜单进行自由扩展。如果你并不需要 Menu 内容，请直接使用 Popover 组件。
 */
import { ChevronDownOutline } from '@metaoa/icons';
import type { MenuProps } from 'meta-ui';
import { Button, Divider, Dropdown, Space } from 'meta-ui';
import React from 'react';

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
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: 0 }} />
          <Space style={{ padding: 8 }}>
            <Button type="primary">Click me!</Button>
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
