import React, { useState } from 'react';
import { BuildingOfficeSolid, UserGroupSolid, UserSolid } from '@metisjs/icons';
import type { GetProp, TabsProps } from 'metis-ui';
import { Segmented, Tabs } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

type TabsType = GetProp<TabsProps, 'type'>;

const items: TabsProps['items'] = [
  {
    key: '1',
    icon: <UserSolid />,
    label: 'My Account',
    content: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    icon: <BuildingOfficeSolid />,
    label: 'Company',
    content: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    icon: <UserGroupSolid />,
    label: 'Team Members',
    content: 'Content of Tab Pane 3',
  },
  ...new Array(10).fill(null).map((_, i) => {
    const id = String(i + 4);
    return {
      label: `Tab ${id}`,
      key: id,
      content: `Content of Tab Pane ${id}`,
    };
  }),
];

const App: React.FC = () => {
  const [type, setType] = useState<TabsType>('line');

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'nav' },
        { name: 'indicator', desc: 'Only for line type' },
        {
          name: 'tab',
          children: [{ name: 'icon' }, { name: 'label' }, { name: 'close' }],
          args: [
            { name: 'active', type: 'boolean' },
            { name: 'removable', type: 'boolean' },
            { name: 'disabled', type: 'boolean' },
            { name: 'renaming', type: 'boolean' },
          ],
        },
        { name: 'addBtn' },
        { name: 'extra' },
        { name: 'operations' },
        { name: 'more' },
        { name: 'content' },
        { name: 'panel', args: [{ name: 'active', type: 'boolean' }] },
      ]}
      extra={<Segmented options={['line', 'pills', 'card']} value={type} onChange={setType} />}
    >
      {(hover) => {
        if (hover?.name === 'indicator') {
          setType('line');
        }
        return (
          <Tabs
            defaultActiveKey="1"
            items={items}
            type={type}
            tabBarExtraContent="Extra"
            addable
            closable
            className="[--card-active-background-color:var(--color-gray-950)]"
          />
        );
      }}
    </SemanticPreview>
  );
};

export default App;
