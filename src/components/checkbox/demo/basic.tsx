import React from 'react';
import { Checkbox } from 'metis-ui';

const onChange = (checked: boolean) => {
  console.log(`checked = ${checked}`);
};

const App: React.FC = () => <Checkbox onChange={onChange}>Checkbox</Checkbox>;

export default App;
