import React from 'react';
import { Mentions } from 'metis-ui';

const App: React.FC = () => (
  <Mentions
    className="w-full"
    placement="top"
    options={[
      {
        value: 'tom',
        label: 'tom',
      },
      {
        value: 'jack',
        label: 'jack',
      },
      {
        value: 'minm',
        label: 'minm',
      },
    ]}
  />
);

export default App;
