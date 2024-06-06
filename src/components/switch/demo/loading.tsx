/**
 * description: 标识开关操作仍在执行中。
 */
import { Switch } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Switch loading defaultChecked />
    <br />
    <Switch size="small" loading />
  </>
);

export default App;
