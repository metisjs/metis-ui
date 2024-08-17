import React from 'react';
import type { SelectProps } from 'metis-ui';
import { Select } from 'metis-ui';

type DisplayRender = SelectProps['displayRender'];

const options = [
  { label: 'Gold', value: 'gold' },
  { label: 'Lime', value: 'lime' },
  { label: 'Green', value: 'green' },
  { label: 'Cyan', value: 'cyan' },
];

const displayRender: DisplayRender = (option) => {
  const { label, value } = option;

  return `${label}(${value})`;
};

const App: React.FC = () => (
  <Select displayRender={displayRender} defaultValue="lime" options={options} className="w-full" />
);

export default App;
