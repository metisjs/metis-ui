import React from 'react';
import { Tag } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }]} rootArgs={[{ name: 'checked', type: 'boolean' }]}>
    <Tag.CheckableTag checked={true}>CheckableTag</Tag.CheckableTag>
  </SemanticPreview>
);

export default App;
