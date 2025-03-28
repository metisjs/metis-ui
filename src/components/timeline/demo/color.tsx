import React from 'react';
import { FaceSmileOutline } from '@metisjs/icons';
import { Timeline } from 'metis-ui';

const App: React.FC = () => (
  <Timeline
    items={[
      {
        color: 'green',
        content: 'Create a services site',
        time: '7d ago',
      },
      {
        color: 'green',
        content: 'Create a services site',
        time: '5d ago',
      },
      {
        color: 'red',
        content: (
          <>
            <p>Solve initial network problems 1</p>
            <p>Solve initial network problems 2</p>
            <p>Solve initial network problems 3</p>
          </>
        ),
        time: '3d ago',
      },
      {
        color: 'blue',
        content: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3</p>
          </>
        ),
        time: '8d ago',
      },
      {
        content: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3</p>
          </>
        ),
        time: '1d ago',
      },
      {
        content: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3</p>
          </>
        ),
        time: '2d ago',
      },
      {
        color: '#00CCFF',
        dot: <FaceSmileOutline />,
        content: <p>Custom color testing</p>,
      },
    ]}
  />
);

export default App;
