import React from 'react';
import { Checkbox } from 'metis-ui';
import type { CheckboxChangeEvent } from 'metis-ui/es/checkbox';

const onChange = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`);
};

const App: React.FC = () => <Checkbox onChange={onChange}>Checkbox</Checkbox>;

export default App;
