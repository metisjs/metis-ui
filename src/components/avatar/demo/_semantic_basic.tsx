import React from 'react';
import { UserSolid } from '@metisjs/icons';
import { Avatar } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'children' }]}>
    <Avatar icon={<UserSolid />} />
  </SemanticPreview>
);

export default App;
