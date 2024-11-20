import React from 'react';
import { Button, Empty } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'image' }, { name: 'description' }, { name: 'footer' }]}
  >
    <Empty>
      <Button type="primary">Create Now</Button>
    </Empty>
  </SemanticPreview>
);

export default App;
