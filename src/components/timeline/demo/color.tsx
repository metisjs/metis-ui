import React from 'react';
import { FaceSmileOutline } from '@metisjs/icons';
import { Timeline } from 'metis-ui';

const App: React.FC = () => (
  <Timeline
    items={[
      {
        color: 'green',
        content: 'Create a services site 2015-09-01',
      },
      {
        color: 'green',
        content: 'Create a services site 2015-09-01',
      },
      {
        color: 'red',
        content: (
          <>
            <p>Solve initial network problems 1</p>
            <p>Solve initial network problems 2</p>
            <p>Solve initial network problems 3 2015-09-01</p>
          </>
        ),
      },
      {
        content: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </>
        ),
      },
      {
        color: 'gray',
        content: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </>
        ),
      },
      {
        color: 'gray',
        content: (
          <>
            <p>Technical testing 1</p>
            <p>Technical testing 2</p>
            <p>Technical testing 3 2015-09-01</p>
          </>
        ),
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
