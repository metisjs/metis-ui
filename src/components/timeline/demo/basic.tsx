import React from 'react';
import { Timeline } from 'metis-ui';

const App: React.FC = () => (
  <Timeline
    items={[
      {
        content: 'Create a services site',
        time: '2015-09-01',
      },
      {
        content: 'Solve initial network problems',
        time: '2015-09-01',
      },
      {
        content: 'Technical testing',
        time: '2015-09-01',
      },
      {
        content: 'Network problems being solved',
        time: '2015-09-01',
      },
    ]}
  />
);

export default App;
