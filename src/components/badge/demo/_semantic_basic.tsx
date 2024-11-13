import React from 'react';
import { Avatar, Badge } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'indicator' }]}>
    <Badge count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
  </SemanticPreview>
);

export default App;
