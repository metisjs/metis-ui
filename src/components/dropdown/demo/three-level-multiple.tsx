import React, { useState } from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';

const items: MenuProps['items'] = [
  {
    key: 'level-1',
    label: 'Level 1',
    children: [
      {
        key: 'level-2',
        label: 'Level 2',
        children: [
          {
            key: 'level-3-1',
            label: 'Level 3 item 1',
          },
          {
            key: 'level-3-2',
            label: 'Level 3 item 2',
          },
        ],
      },
      {
        key: 'level-2-1',
        label: 'Level 2 item 1',
      },
    ],
  },
  {
    key: 'other',
    label: 'Other item',
  },
];

const App: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<(string | number)[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);

  return (
    <Space>
      <Dropdown
        menu={{
          items,
          multiple: true,
          openKeys,
          selectedKeys,
          onOpenChange: setOpenKeys,
          onSelect: ({ selectedKeys: nextKeys }) => setSelectedKeys(nextKeys),
          onDeselect: ({ selectedKeys: nextKeys }) => setSelectedKeys(nextKeys),
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Hover me
            <ChevronDownOutline className="size-4" />
          </Space>
        </a>
      </Dropdown>
      <span>openKeys: [{openKeys.join(', ')}]</span>
      <span>selectedKeys: [{selectedKeys.join(', ')}]</span>
    </Space>
  );
};

export default App;
