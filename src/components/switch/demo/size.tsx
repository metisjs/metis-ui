import React from 'react';
import { Space, Switch } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical>
    <Switch defaultChecked />
    <Switch size="small" defaultChecked />
  </Space>
);

export default App;
