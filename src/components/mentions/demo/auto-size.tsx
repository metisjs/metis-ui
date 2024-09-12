import React from 'react';
import { Mentions } from 'metis-ui';

const App: React.FC = () => (
  <Mentions
    autoSize
    className="w-full"
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
