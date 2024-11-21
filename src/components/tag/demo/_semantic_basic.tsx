import React from 'react';
import { AcademicCapOutline } from '@metisjs/icons';
import { Tag } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'icon' }, { name: 'close' }]}>
    <Tag icon={<AcademicCapOutline />} closable>
      AcademicCap
    </Tag>
  </SemanticPreview>
);

export default App;
