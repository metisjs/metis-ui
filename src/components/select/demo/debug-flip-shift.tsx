import React from 'react';
import { Select } from 'metis-ui';

const App: React.FC = () => (
  <Select
    className="mt-[50vh] w-30"
    options={new Array(100).fill(null).map((_, index) => ({
      value: index,
    }))}
  />
);

export default App;
