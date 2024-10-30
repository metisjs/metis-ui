import React from 'react';
import { Descriptions } from 'metis-ui';
import type { DescriptionsProps } from 'metis-ui';

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'UserName',
    content: 'Zhou Maomao',
  },
  {
    key: '2',
    label: 'Telephone',
    content: '1810000000',
  },
  {
    key: '3',
    label: 'Live',
    content: 'Hangzhou, Zhejiang',
  },
  {
    key: '4',
    label: 'Address',
    span: 2,
    content: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
  {
    key: '5',
    label: 'Remark',
    content: 'empty',
  },
];

const App: React.FC = () => <Descriptions title="User Info" layout="vertical" items={items} />;

export default App;
