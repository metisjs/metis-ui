import React, { useState } from 'react';
import { BuildingOfficeSolid, UserGroupSolid, UserSolid } from '@metisjs/icons';
import type { GetProp, TabsProps } from 'metis-ui';
import { Segmented, Tabs } from 'metis-ui';

type SizeType = GetProp<TabsProps, 'size'>;

const items: TabsProps['items'] = [
  {
    key: '1',
    icon: <UserSolid />,
    label: 'My Account',
    content: (
      <>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
      </>
    ),
  },
  {
    key: '2',
    icon: <BuildingOfficeSolid />,
    label: 'Company',
    content: (
      <>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </>
    ),
  },
  {
    key: '3',
    icon: <UserGroupSolid />,
    label: 'Team Members',
    content: (
      <>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </>
    ),
  },
];

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('default');

  return (
    <div>
      <Segmented
        options={['default', 'middle', 'small']}
        value={size}
        onChange={setSize}
        className="mb-4"
      />
      <Tabs defaultActiveKey="1" size={size} className="mb-8" items={items} />
      <Tabs defaultActiveKey="1" type="pills" size={size} className="mb-8" items={items} />
      <Tabs defaultActiveKey="1" type="card" size={size} items={items} />
    </div>
  );
};

export default App;
