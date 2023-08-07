/**
 * description: 使用 `popupRender` 对下拉菜单进行自由扩展。如果希望点击自定义内容后关闭浮层，你需要使用受控模式自行控制
 */
import { PlusOutline } from '@metaoa/icons';
import type { InputRef } from 'meta-ui';
import { Button, Divider, Input, Select, Space } from 'meta-ui';
import React, { useRef, useState } from 'react';

let index = 0;

const App: React.FC = () => {
  const [items, setItems] = useState(['jack', 'lucy']);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

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
      style={{ width: 320 }}
      placeholder="custom dropdown render"
      popupRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
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
