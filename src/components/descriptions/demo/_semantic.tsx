import React from 'react';
import type { DescriptionsProps } from 'metis-ui';
import { Descriptions } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

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
const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'header' },
      { name: 'title' },
      { name: 'extra' },
      { name: 'view' },
      { name: 'item', children: [{ name: 'label' }, { name: 'content' }] },
    ]}
    rootArgs={[
      { name: 'bordered', type: 'boolean' },
      { name: 'layout', type: "'horizontal'|'vertical'" },
    ]}
  >
    <Descriptions bordered title="User Info" extra="Extra" items={items} />
  </SemanticPreview>
);

export default App;
