import React from 'react';
import type { StepsProps } from 'metis-ui';
import { Avatar, List, Steps } from 'metis-ui';

const data = [
  {
    title: 'Metis Title 1',
    current: 0,
  },
  {
    title: 'Metis Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'Metis Title 3',
    current: 2,
  },
  {
    title: 'Metis Title 4',
    current: 1,
  },
];

const items = [
  {
    title: 'Step 1',
    description: 'This is a Step 1.',
  },
  {
    title: 'Step 2',
    description: 'This is a Step 2.',
  },
  {
    title: 'Step 3',
    description: 'This is a Step 3.',
  },
];

const App: React.FC = () => (
  <List
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={<a href="https://metisui.com">{item.title}</a>}
          description="Metis, a design language for background applications, is refined by Ant UED Team"
        />
        <Steps
          className="mt-2"
          type="inline"
          current={item.current}
          status={item.status as StepsProps['status']}
          items={items}
        />
      </List.Item>
    )}
  />
);

export default App;
