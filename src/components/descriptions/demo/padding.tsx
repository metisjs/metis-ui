import React from 'react';
import { Descriptions, Space } from 'metis-ui';
import type { DescriptionsProps } from 'metis-ui';

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'long',
    content: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '2',
    label: 'long',
    content: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '3',
    label: 'long',
    content: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '4',
    label: 'long',
    content: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
  {
    key: '5',
    label: 'long',
    content: 'loooooooooooooooooooooooooooooooooooooooooooooooong',
  },
];

const App: React.FC = () => (
  <Space size={8} vertical block>
    <div className="w-150 border border-indigo-500 p-4">
      <Descriptions title="User Info" column={2} items={items} />
    </div>
    <div className="w-150 border border-indigo-500 p-4">
      <Descriptions layout="vertical" title="User Info" column={2} items={items} />
    </div>
  </Space>
);

export default App;
