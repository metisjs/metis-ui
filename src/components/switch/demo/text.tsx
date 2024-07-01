import { Space, Switch } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical>
    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
    <Switch checkedChildren="1" unCheckedChildren="0" />
  </Space>
);

export default App;
