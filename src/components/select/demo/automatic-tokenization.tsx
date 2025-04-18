import React from 'react';
import type { SelectProps } from 'metis-ui';
import { Select } from 'metis-ui';

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Select
    mode="tags"
    className="w-full"
    onChange={handleChange}
    tokenSeparators={[',']}
    options={options}
  />
);

export default App;
