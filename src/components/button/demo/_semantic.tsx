import React from 'react';
import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'icon' }]}>
    <Button type="primary" icon={<MagnifyingGlassOutline />}>
      Search
    </Button>
  </SemanticPreview>
);

export default App;
