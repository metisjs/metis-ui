import React from 'react';
import { Button, Popover, Space } from 'metis-ui';

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const App: React.FC = () => (
  <Space wrap>
    <Popover content={content} title="Title" trigger="hover">
      <Button>Hover me</Button>
    </Popover>
    <Popover content={content} title="Title" trigger="focus">
      <Button>Focus me</Button>
    </Popover>
    <Popover content={content} title="Title" trigger="click">
      <Button>Click me</Button>
    </Popover>
    <Popover content={content} title="Title" trigger="doubleClick">
      <Button>Double click me</Button>
    </Popover>
  </Space>
);

export default App;
