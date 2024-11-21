import React from 'react';
import { Timeline } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'item',
        children: [{ name: 'label' }, { name: 'content' }, { name: 'dot' }, { name: 'tail' }],
        args: [
          { name: 'last', type: 'boolean' },
          { name: 'pending', type: 'boolean' },
        ],
      },
    ]}
  >
    <Timeline
      pending="Recording..."
      items={[
        {
          label: '2015-09-01',
          content: 'Create a services',
        },
        {
          label: '2015-09-01 09:12:11',
          content: 'Solve initial network problems',
        },
        {
          content: 'Technical testing',
        },
        {
          label: '2015-09-01 09:12:11',
          content: 'Network problems being solved',
        },
      ]}
      className="w-full"
    />
  </SemanticPreview>
);

export default App;
