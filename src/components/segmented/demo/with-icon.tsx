import { PuzzlePieceOutline, QueueListOutline } from '@metaoa/icons';
import { Segmented } from 'meta-ui';
import React from 'react';

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
