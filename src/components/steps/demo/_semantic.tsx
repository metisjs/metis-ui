import React from 'react';
import { Steps } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const description = 'This is a description.';
const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      {
        name: 'item',
        children: [
          { name: 'icon' },
          { name: 'content' },
          { name: 'title' },
          { name: 'description' },
        ],
        args: [{ name: 'status', type: `'wait' | 'process' | 'finish' | 'error'` }],
      },
    ]}
  >
    <Steps
      current={1}
      items={[
        {
          title: 'Finished',
          description,
        },
        {
          title: 'In Progress',
          description,
        },
        {
          title: 'Waiting',
          description,
        },
      ]}
    />
  </SemanticPreview>
);

export default App;
