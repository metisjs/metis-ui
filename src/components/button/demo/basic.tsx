/**
 * description: 按钮有四种类型：主按钮、次按钮、文本按钮和链接按钮。主按钮在同一个操作区域最多出现一次。
 */
import { Button, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </Space>
);

export default App;
