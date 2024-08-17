import React from 'react';
import { PuzzlePieceOutline, QueueListOutline } from '@metisjs/icons';
import { Segmented } from 'metis-ui';

export default () => (
  <Segmented
    options={[
      {
        value: 'List',
        icon: <QueueListOutline />,
      },
      {
        value: 'Kanban',
        icon: <PuzzlePieceOutline />,
      },
    ]}
  />
);
