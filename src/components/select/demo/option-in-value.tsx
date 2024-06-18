import { Select } from 'metis-ui';
import React from 'react';

const handleChange = (value: { value: string; label: React.ReactNode }) => {
  console.log(value); // { value: "lucy", label: "Lucy (101)" }
};

const App: React.FC = () => (
  <Select
    optionInValue
    defaultValue={{ value: 'lucy', label: 'Lucy (101)' }}
    style={{ width: 160 }}
    onChange={handleChange}
    options={[
      {
        value: 'jack',
        label: 'Jack (100)',
      },
      {
        value: 'lucy',
        label: 'Lucy (101)',
      },
    ]}
  />
);

export default App;
