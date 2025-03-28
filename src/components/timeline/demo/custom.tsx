import React from 'react';
import { ClockOutline } from '@metisjs/icons';
import { Timeline } from 'metis-ui';

const App: React.FC = () => (
  <Timeline
    items={[
      {
        content: 'Create a services site',
        time: '2025-04-01',
      },
      {
        content: 'Solve initial network problems',
        time: '2025-04-01',
      },
      {
        dot: <ClockOutline />,
        color: 'red',
        content: 'Technical testing',
        time: '2025-04-01',
      },
      {
        content: 'Network problems being solved',
        time: '2025-04-01',
      },
    ]}
  />
);

export default App;
