import React, { useMemo, useRef, useState } from 'react';
import type { ListRef } from 'metis-ui';
import { Avatar, Button, List, Segmented, Space } from 'metis-ui';

const App: React.FC = () => {
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('start');
  const listRef = useRef<ListRef>(null);

  const users = useMemo(() => {
    return Array.from({ length: 100000 }, (_, index) => ({
      name: `User ${index}`,
      description: `Description for user ${index}`,
    }));
  }, []);

  return (
    <Space vertical block>
      <Space block>
        <Button
          onClick={() => {
            listRef.current?.scrollTo({
              index: 1,
              align,
            });
          }}
        >
          goto 1
        </Button>
        <Button
          onClick={() => {
            listRef.current?.scrollTo({
              index: 500,
              align,
            });
          }}
        >
          goto 500
        </Button>
        <Button
          onClick={() => {
            listRef.current?.scrollTo({
              index: 1000,
              align,
            });
          }}
        >
          goto 1000
        </Button>
        <Space className="ml-auto">
          Align:
          <Segmented options={['start', 'center', 'end']} value={align} onChange={setAlign} />
        </Space>
      </Space>
      <List
        virtual
        ref={listRef}
        className="h-[400px]"
        dataSource={users}
        renderItem={(item) => (
          <List.Item key={item.name}>
            <List.Item.Meta
              avatar={<Avatar>U</Avatar>}
              title={<a href="#">{item.name}</a>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Space>
  );
};

export default App;
