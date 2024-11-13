import React from 'react';
import { MagnifyingGlassOutline } from '@metisjs/icons';
import { Button } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'icon' }]}>
    <Button type="primary" shape="round" icon={<MagnifyingGlassOutline />} />
  </SemanticPreview>
);

export default App;
