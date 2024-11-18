import React from 'react';
import { Rate } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'star',
        children: [{ name: 'first' }, { name: 'second' }],
        args: [{ name: 'active', type: 'boolean' }],
      },
    ]}
    rootArgs={[{ name: 'disabled', type: 'boolean' }]}
  >
    <Rate allowHalf defaultValue={2.5} />
  </SemanticPreview>
);

export default App;
