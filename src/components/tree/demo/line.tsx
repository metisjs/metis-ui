import React, { useState } from 'react';
import { DevicePhoneMobileOutline, PencilSquareOutline } from '@metisjs/icons';
import type { TreeDataNode } from 'metis-ui';
import { Switch, Tree } from 'metis-ui';

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: <DevicePhoneMobileOutline />,
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        icon: <DevicePhoneMobileOutline />,
        children: [
          { title: 'leaf', key: '0-0-0-0', icon: <DevicePhoneMobileOutline /> },
          {
            title: (
              <>
                <div>multiple line title</div>
                <div>multiple line title</div>
              </>
            ),
            key: '0-0-0-1',
            icon: <DevicePhoneMobileOutline />,
          },
          { title: 'leaf', key: '0-0-0-2', icon: <DevicePhoneMobileOutline /> },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        icon: <DevicePhoneMobileOutline />,
        children: [{ title: 'leaf', key: '0-0-1-0', icon: <DevicePhoneMobileOutline /> }],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        icon: <DevicePhoneMobileOutline />,
        children: [
          { title: 'leaf', key: '0-0-2-0', icon: <DevicePhoneMobileOutline /> },
          {
            title: 'leaf',
            key: '0-0-2-1',
            icon: <DevicePhoneMobileOutline />,
            switcherIcon: <PencilSquareOutline />,
          },
        ],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '0-1',
    icon: <DevicePhoneMobileOutline />,
    children: [
      {
        title: 'parent 2-0',
        key: '0-1-0',
        icon: <DevicePhoneMobileOutline />,
        children: [
          { title: 'leaf', key: '0-1-0-0', icon: <DevicePhoneMobileOutline /> },
          { title: 'leaf', key: '0-1-0-1', icon: <DevicePhoneMobileOutline /> },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [showLine, setShowLine] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(false);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        showLine: <Switch checked={!!showLine} onChange={setShowLine} />
        <br />
        <br />
        showIcon: <Switch checked={showIcon} onChange={setShowIcon} />
      </div>
      <Tree
        showLine={showLine}
        showIcon={showIcon}
        defaultExpandedKeys={['0-0-0']}
        onSelect={onSelect}
        treeData={treeData}
      />
    </div>
  );
};

export default App;
