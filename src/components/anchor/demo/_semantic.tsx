import React from 'react';
import { Anchor } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'ink' }, { name: 'link', children: [{ name: 'title' }] }]}
  >
    <Anchor
      affix={false}
      items={[
        {
          key: 'part-1',
          href: '#api',
          title: 'Part 1',
        },
        {
          key: 'part-2',
          href: '#part-2',
          title: 'Part 2',
        },
        {
          key: 'part-3',
          href: '#part-3',
          title: 'Part 3',
        },
      ]}
    />
  </SemanticPreview>
);

export default App;
