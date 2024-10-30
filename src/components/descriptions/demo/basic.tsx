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
    label: 'Remark',
    content: 'empty',
  },
  {
    key: '5',
    label: 'Address',
    content: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China',
  },
];

const App: React.FC = () => <Descriptions title="User Info" items={items} />;

export default App;
