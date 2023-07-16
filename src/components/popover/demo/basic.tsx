/**
 * description: 最简单的用法，浮层的大小由内容区域决定。
 */
import { Button, Popover } from 'meta-ui';
import React from 'react';

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const App: React.FC = () => (
  <Popover content={content} title="Title">
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default App;
