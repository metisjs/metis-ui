import React from 'react';
import { Button, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space wrap>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </Space>
);

export default App;
