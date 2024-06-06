import { PuzzlePieceOutline, QueueListOutline } from '@metisjs/icons';
import { Segmented } from 'meta-ui';
import React from 'react';

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
