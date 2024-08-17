import React from 'react';
import { Select } from 'metis-ui';

const App: React.FC = () => (
  <Select
    style={{ width: 120, marginTop: '50vh' }}
    options={new Array(100).fill(null).map((_, index) => ({
      value: index,
    }))}
  />
);

export default App;
