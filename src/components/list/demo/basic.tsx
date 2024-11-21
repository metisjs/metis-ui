import React, { useState } from 'react';
import { Avatar, List, Space, Switch } from 'metis-ui';

const data = [
  {
    title: 'Metis Title 1',
  },
  {
    title: 'Metis Title 2',
  },
  {
    title: 'Metis Title 3',
  },
  {
    title: 'Metis Title 4',
  },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [bordered, setBordered] = useState(false);
  const [headerAndFooter, setHeaderAndFooter] = useState(false);

  return (
    <Space vertical block>
      <Space size={24}>
        <span>
          Loading: <Switch checked={loading} onChange={setLoading} />
        </span>
        <span>
          Bordered: <Switch checked={bordered} onChange={setBordered} />
        </span>
        <span>
          Header&Footer: <Switch checked={headerAndFooter} onChange={setHeaderAndFooter} />
        </span>
      </Space>
      <List
        loading={loading}
        bordered={bordered}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item actions={[<a key="list-edit">Edit</a>, <a key="list-delete">Delete</a>]}>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<a href="#">{item.title}</a>}
              description="Metis UI is an open-source component library that combines Tailwind CSS and Metis UI."
            />
            <div>content</div>
          </List.Item>
        )}
        {...(headerAndFooter && {
          header: 'Header',
          footer: 'Footer',
        })}
      />
    </Space>
  );
};

export default App;
