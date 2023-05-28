/**
 * description: 简单的 checkbox。
 */
import { Checkbox } from 'meta-ui';
import type { CheckboxChangeEvent } from 'meta-ui/es/checkbox';
import React from 'react';

const onChange = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`);
};

const App: React.FC = () => <Checkbox onChange={onChange}>Checkbox</Checkbox>;

export default App;
