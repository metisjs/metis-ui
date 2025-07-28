import React, { useRef } from 'react';
import type { ListRef } from 'metis-ui';
import { Avatar, Button, List } from 'metis-ui';

interface DataType {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

const fakeFetch = (params: {
  current: number;
  pageSize: number;
}): Promise<{ total: number; data: DataType[] }> => {
  return fetch(
    `https://randomuser.me/api/?results=${params.pageSize}&inc=name,gender,email,nat,picture&noinfo`,
  )
    .then((res) => res.json())
    .then((body) => ({ data: body.results, total: 100 }));
};

const App: React.FC = () => {
  const listRef = useRef<ListRef>(null);
  return (
    <>
      <Button type="primary" className="mb-2" onClick={() => listRef.current?.reload()}>
        Refresh
      </Button>
      <List
        ref={listRef}
        className="h-80"
        lazyLoad
        request={fakeFetch}
        renderItem={(item, i) => (
          <List.Item key={i}>
            <List.Item.Meta
              avatar={<Avatar src={item.picture.large} />}
              title={<a href="#">{item.name.last}</a>}
              description={item.email}
            />
            <div>Content</div>
          </List.Item>
        )}
        locale={{ noMoreText: 'It is all, nothing more' }}
      />
    </>
  );
};

export default App;
