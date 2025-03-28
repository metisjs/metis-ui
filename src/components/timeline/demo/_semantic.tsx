import React from 'react';
import { Timeline } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'item',
        children: [{ name: 'time' }, { name: 'content' }, { name: 'dot' }, { name: 'tail' }],
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
          time: '2015-09-01',
          content: 'Create a services',
        },
        {
          time: '2015-09-01',
          content: 'Solve initial network problems',
        },
        {
          content: 'Technical testing',
        },
        {
          time: '2015-09-01',
          content: 'Network problems being solved',
        },
      ]}
      className="w-[420px]"
    />
  </SemanticPreview>
);

export default App;
