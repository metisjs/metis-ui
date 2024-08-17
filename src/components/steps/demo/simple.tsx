import React from 'react';
import { Divider, Steps } from 'metis-ui';

const App: React.FC = () => (
  <>
    <Steps
      type="simple"
      current={1}
      items={[
        {
          title: 'Finished',
        },
        {
          title: 'In Progress',
        },
        {
          title: 'Waiting',
        },
        {
          title: 'Waiting',
        },
      ]}
    />
    <Divider />
    <Steps type="simple" current={1} direction="vertical" items={[{}, {}, {}, {}, {}, {}]} />
  </>
);

export default App;
