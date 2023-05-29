/**
 * description: `size="small"` 表示小号开关。
 */
import { Switch } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Switch defaultChecked />
    <br />
    <Switch size="small" defaultChecked />
  </>
);

export default App;
