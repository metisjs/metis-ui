import React from 'react';
import { Button, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space>
    <Space.Compact vertical>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Space.Compact>
    <Space.Compact vertical>
      <Button type="primary">Button 1</Button>
      <Button type="primary">Button 2</Button>
      <Button type="primary">Button 3</Button>
    </Space.Compact>
  </Space>
);

export default App;
