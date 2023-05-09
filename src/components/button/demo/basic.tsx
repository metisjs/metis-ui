import { Button, Space } from '@meta/ui';
import React from 'react';

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary">按钮</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </Space>
);

export default App;
