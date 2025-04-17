import React, { useState } from 'react';
import type { GetProp, TabsProps } from 'metis-ui';
import { Select, Space, Tabs } from 'metis-ui';

type TabPosition = GetProp<TabsProps, 'tabPosition'>;
type TabType = GetProp<TabsProps, 'type'>;

const positionList = ['left', 'right', 'top', 'bottom'] as const;

const App: React.FC = () => {
  const [parentPos, setParentPos] = useState<TabPosition>('top');
  const [childPos, setChildPos] = useState<TabPosition>('top');
  const [parentType, setParentType] = useState<TabType>('line');
  const [childType, setChildType] = useState<TabType>('line');

  return (
    <Space vertical block>
      <Space block>
        <Select<TabPosition>
          className="w-40"
          value={parentPos}
          options={positionList.map((pos) => ({
            key: pos,
            value: pos,
            label: `Parent - ${pos}`,
          }))}
          onChange={setParentPos}
        ></Select>

        <Select<TabPosition>
          className="w-40"
          value={childPos}
          options={positionList.map((pos) => ({
            key: pos,
            value: pos,
            label: `Child - ${pos}`,
          }))}
          onChange={setChildPos}
        ></Select>

        <Select<TabType>
          value={parentType}
          className="w-40"
          options={[
            {
              label: 'Parent - line',
              value: 'line',
            },
            {
              label: 'Parent - pills',
              value: 'pills',
            },
            {
              label: 'Parent - card',
              value: 'card',
            },
          ]}
          onChange={setParentType}
        ></Select>

        <Select<TabType>
          className="w-40"
          value={childType}
          options={[
            {
              label: 'Child - line',
              value: 'line',
            },
            {
              label: 'Child - pills',
              value: 'pills',
            },
            {
              label: 'Child - card',
              value: 'card',
            },
          ]}
          onChange={setChildType}
        ></Select>
      </Space>
      <Tabs
        defaultActiveKey="1"
        tabPosition={parentPos}
        type={parentType}
        items={[
          {
            label: 'My Account',
            key: '1',
            content: (
              <Tabs
                defaultActiveKey="1"
                tabPosition={childPos}
                type={childType}
                items={new Array(20).fill(null).map((_, index) => {
                  const key = String(index);
                  return {
                    label: `Tab ${key}`,
                    key,
                    content: `TTTT ${key}`,
                  };
                })}
                className="w-75 dark:[--card-active-background-color:var(--color-gray-950)]"
              />
            ),
          },
          {
            label: 'Company',
            key: '2',
            content: 'Content of Tab Pane 2',
          },
        ]}
        className="dark:[--card-active-background-color:var(--color-gray-950)]"
      />
    </Space>
  );
};

export default App;
