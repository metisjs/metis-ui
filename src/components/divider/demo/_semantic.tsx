import React from 'react';
import { Divider } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'text' }]}>
    <Divider>Text</Divider>
  </SemanticPreview>
);

export default App;
