import { Space, Switch } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical">
    <Switch defaultChecked />
    <Switch size="small" defaultChecked />
  </Space>
);

export default App;
