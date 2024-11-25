import React from 'react';
import { Skeleton } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'avatar' }, { name: 'title' }, { name: 'paragraph' }]}
  >
    <Skeleton avatar title paragraph={{ rows: 2 }} className="w-[360px]" />
  </SemanticPreview>
);

export default App;
