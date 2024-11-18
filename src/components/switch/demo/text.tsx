import React from 'react';
import { Space, Switch } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical>
    <Switch checkedChildren="Open" unCheckedChildren="Close" defaultChecked />
    <Switch checkedChildren="1" unCheckedChildren="0" />
  </Space>
);

export default App;
