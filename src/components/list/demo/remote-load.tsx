import React from 'react';
import { Avatar, List } from 'metis-ui';

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

const fakeFetch = (): Promise<{ data: DataType[] }> => {
  return fetch(`https://randomuser.me/api/?results=15&inc=name,gender,email,nat,picture&noinfo`)
    .then((res) => res.json())
    .then((body) => ({ data: body.results }));
};

const App: React.FC = () => (
  <List
    request={fakeFetch}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={item.picture.large} />}
          title={<a href="#">{item.name.last}</a>}
          description={item.email}
        />
        <div>Content</div>
      </List.Item>
    )}
  />
);

export default App;
