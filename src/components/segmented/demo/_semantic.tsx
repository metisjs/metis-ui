import React from 'react';
import { PuzzlePieceOutline, QueueListOutline } from '@metisjs/icons';
import { Segmented } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'option', children: [{ name: 'content' }, { name: 'icon' }, { name: 'label' }] },
    ]}
  >
    <Segmented
      options={[
        {
          label: 'List',
          value: 'List',
          icon: <QueueListOutline />,
        },
        {
          label: 'Kanban',
          value: 'Kanban',
          icon: <PuzzlePieceOutline />,
        },
      ]}
    />
  </SemanticPreview>
);

export default App;
