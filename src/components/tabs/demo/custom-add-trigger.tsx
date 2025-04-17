import React, { useRef, useState } from 'react';
import { Button, Tabs } from 'metis-ui';

const defaultPanes = new Array(2).fill(null).map((_, index) => {
  const id = String(index + 1);
  return { label: `Tab ${id}`, content: `Content of Tab Pane ${index + 1}`, key: id };
});

const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const onAdd = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([...items, { label: 'New Tab', content: 'New Tab Pane', key: newActiveKey }]);
    setActiveKey(newActiveKey);
  };

  const onClose = (targetKey: React.Key) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  return (
    <div>
      <div className="mb-4">
        <Button onClick={onAdd}>ADD</Button>
      </div>
      <Tabs
        onChange={onChange}
        activeKey={activeKey}
        type="card"
        onClose={onClose}
        items={items}
        closable
        className="dark:[--card-active-background-color:var(--color-gray-950)]"
      />
    </div>
  );
};

export default App;
