import { PuzzlePieceOutline, QueueListOutline } from '@metaoa/icons';
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
