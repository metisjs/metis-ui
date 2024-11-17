import React from 'react';
import { Radio } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'indicator' }, { name: 'label' }]}
    rootArgs={[
      { name: 'checked', type: 'boolean' },
      { name: 'disabled', type: 'boolean' },
    ]}
  >
    <Radio>Radio</Radio>
  </SemanticPreview>
);

export default App;
