import React from 'react';
import { PuzzlePieceOutline, QueueListOutline } from '@metisjs/icons';
import { Segmented } from 'metis-ui';

export default () => (
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
);
