import React from 'react';
import { Avatar, List } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

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
const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'header' },
      { name: 'body' },
      {
        name: 'item',
        children: [
          {
            name: 'meta',
            children: [
              { name: 'avatar' },
              { name: 'title' },
              { name: 'content' },
              { name: 'description' },
            ],
          },
          { name: 'actions' },
          { name: 'extra' },
        ],
      },
      { name: 'footer' },
    ]}
    rootArgs={[{ name: 'bordered', type: 'boolean' }]}
  >
    <List
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item
          extra="Extra"
          actions={[<a key="list-edit">Edit</a>, <a key="list-delete">Delete</a>]}
        >
          <List.Item.Meta
            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            title={<a href="#">{item.title}</a>}
            description="Metis UI is an open-source component library that combines Tailwind CSS and Metis UI."
          />
        </List.Item>
      )}
      header="Header"
      footer="Footer"
    />
  </SemanticPreview>
);

export default App;
