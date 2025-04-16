import React, { useRef, useState } from 'react';
import { PlusOutline } from '@metisjs/icons';
import type { InputRef } from 'metis-ui';
import { Button, Divider, Input, Select, Space } from 'metis-ui';

let index = 0;

const App: React.FC = () => {
  const [items, setItems] = useState(['jack', 'lucy']);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      className="w-80"
      placeholder="custom dropdown render"
      popupRender={(menu) => (
        <>
          {menu}
          <Divider className="mx-0 my-2" />
          <Space className="px-2 pb-1">
            <Input placeholder="Please enter item" ref={inputRef} value={name} onChange={setName} />
            <Button type="text" icon={<PlusOutline />} onClick={addItem}>
              Add item
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({ label: item, value: item }))}
    />
  );
};

export default App;
