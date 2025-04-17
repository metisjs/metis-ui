import React, { useRef, useState } from 'react';
import { BuildingOfficeSolid, UserGroupSolid, UserSolid } from '@metisjs/icons';
import type { TabsProps, TabsRef } from 'metis-ui';
import { Space, Tabs } from 'metis-ui';
import type { SafeKey } from 'metis-ui/es/_util/type';
import type { MenuInfo } from 'metis-ui/es/menu/interface';
import type { Tab } from 'metis-ui/es/tabs/interface';

const initialItems: TabsProps['items'] = [
  { icon: <UserSolid />, label: 'My Account', content: 'Content of My Account', key: 1 },
  { icon: <BuildingOfficeSolid />, label: 'Company', content: 'Content of Company', key: 2 },
  {
    icon: <UserGroupSolid />,
    label: 'Team Members',
    content: 'Content of Team Members',
    key: 3,
    closable: false,
  },
];

const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const tabsRef1 = useRef<TabsRef>(null);
  const tabsRef2 = useRef<TabsRef>(null);
  const tabsRef3 = useRef<TabsRef>(null);

  const onChange = (newActiveKey: string | number) => {
    setActiveKey(newActiveKey);
  };

  const onAdd = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({ label: 'New Tab', content: 'Content of new Tab', key: newActiveKey });
    setItems(newPanes);
    setActiveKey(newActiveKey);

    return newActiveKey;
  };

  const onClose = (targetKey: React.Key) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }

    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onRename = (key: SafeKey, name: string) => {
    const item = items.find((item) => item.key === key);
    if (item) {
      item.label = name;
      setItems([...items]);
    }
  };

  const renderTabContextMenu = (tab: Tab, ref: React.RefObject<TabsRef | null>) => ({
    items: [
      {
        key: 'rename',
        label: 'Rename',
        onClick: () => ref.current?.triggerRename(tab.key),
      },
      {
        key: 'close',
        label: 'Close',
        disabled: !tab.closable,
        onClick: () => onClose(tab.key),
      },
      {
        key: 'others',
        label: 'Others...',
        onClick(info: MenuInfo) {
          console.log(`Content menu click tab-key:${tab.key} menu-key:${info.key}`);
        },
      },
    ],
  });

  const commonProps: TabsProps = {
    activeKey,
    items,
    onChange,
    onAdd,
    onClose,
    onRename,
    closable: true,
    addable: true,
    renameAfterAdd: true,
  };

  return (
    <Space vertical block size={32}>
      <Tabs
        ref={tabsRef1}
        {...commonProps}
        renderTabContextMenu={(tab) => renderTabContextMenu(tab, tabsRef1)}
      />
      <Tabs
        ref={tabsRef2}
        type="pills"
        {...commonProps}
        renderTabContextMenu={(tab) => renderTabContextMenu(tab, tabsRef2)}
      />
      <Tabs
        ref={tabsRef3}
        type="card"
        {...commonProps}
        renderTabContextMenu={(tab) => renderTabContextMenu(tab, tabsRef3)}
        className="dark:[--card-active-background-color:var(--color-gray-950)]"
      />
    </Space>
  );
};

export default App;
