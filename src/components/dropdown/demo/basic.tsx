/**
 * description: 最简单的下拉菜单。
 */
import { ChevronDownOutline, FaceSmileOutline } from '@metaoa/icons';
import type { MenuProps } from 'meta-ui';
import { Dropdown, Space } from 'meta-ui';
import React from 'react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item (disabled)',
    icon: <FaceSmileOutline />,
    disabled: true,
  },
  {
    key: '3',
    label: '3rd menu item (disabled)',
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <ChevronDownOutline className="h-5 w-5" />
      </Space>
    </a>
  </Dropdown>
);

export default App;
