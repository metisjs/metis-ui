import React from 'react';
import { ChevronDownOutline, FaceSmileOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';

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
        <ChevronDownOutline className="size-4" />
      </Space>
    </a>
  </Dropdown>
);

export default App;
