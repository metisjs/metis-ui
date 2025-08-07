import React, { useRef, useState } from 'react';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import type { ListRef } from 'metis-ui';
import { Avatar, Button, Input, List } from 'metis-ui';

interface MessageType {
  key: number;
  content: string;
  sender: {
    key: number;
    name: string;
    avatar: string;
  };
  sendTime: number;
}

const dataSource: MessageType[] = Array.from({ length: 100 }, (_, index) => ({
  key: index + 1,
  content: faker.lorem.paragraph({ min: 1, max: 2 }),
  sender: {
    key: faker.number.int({ min: 1, max: 1000 }),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
  },
  sendTime: faker.date.recent().getTime(),
})).sort((a, b) => b.sendTime - a.sendTime);

const fakeFetch = (params: {
  current: number;
  pageSize: number;
}): Promise<{ total: number; data: MessageType[] }> => {
  const start = (params.current - 1) * params.pageSize;
  const end = start + params.pageSize;
  const pageData = dataSource.slice(start, end);

  return Promise.resolve({
    data: pageData.reverse(),
    total: dataSource.length,
  });
};

const my = {
  key: 999,
  name: faker.person.fullName(),
  avatar: faker.image.avatar(),
};

const App: React.FC = () => {
  const listRef = useRef<ListRef<MessageType>>(null);

  const [value, setValue] = useState('');

  const handleSend = async () => {
    if (!value) return;

    listRef.current?.setDataSource((prev = []) => [
      ...prev,
      {
        key: Date.now(),
        content: value,
        sender: my,
        sendTime: Date.now(),
      },
    ]);

    setValue('');
  };

  const renderItem = (item: MessageType) => (
    <div className="flex flex-row gap-2 px-3 py-2">
      <Avatar size={24} src={item.sender.avatar} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span>{item.sender.name}</span>
          <span className="text-text-tertiary ml-auto">
            {dayjs(item.sendTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
        <div className="bg-primary-bg mt-3 flex w-fit items-center rounded-lg rounded-tl-none p-2 leading-5">
          {item.content}
        </div>
      </div>
    </div>
  );
  return (
    <>
      <List
        ref={listRef}
        className="h-120"
        lazyLoad={{ direction: 'top' }}
        request={fakeFetch}
        rowKey="key"
        split={false}
        followOutput
        alignToBottom
        renderItem={renderItem}
      />
      <div className="mt-6 flex">
        <Input.TextArea
          rows={1}
          autoSize
          value={value}
          onChange={setValue}
          className="resize-none"
          onPressEnter={(e) => {
            e.preventDefault();
            handleSend();
          }}
        />
        <Button className="ml-2" type="primary" onClick={handleSend}>
          发送
        </Button>
      </div>
    </>
  );
};

export default App;
