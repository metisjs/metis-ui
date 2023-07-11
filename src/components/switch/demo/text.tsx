/**
 * description: 带有文字和图标。
 */
import { Space, Switch } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical">
    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
    <Switch checkedChildren="1" unCheckedChildren="0" />
  </Space>
);

export default App;
