/**
 * description: 最简单的用法。
 */
import { Switch } from 'metis-ui';
import React from 'react';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const App: React.FC = () => <Switch defaultChecked onChange={onChange} />;

export default App;
