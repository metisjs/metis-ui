/**
 * description: 幽灵按钮将按钮的内容反色，背景变为透明，常用在有色背景上。
 */
import { Button, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space className="bg-slate-400 p-2">
    <Button type="primary" ghost>
      Primary
    </Button>
    <Button ghost>Default</Button>
    <Button type="primary" danger ghost>
      Danger
    </Button>
  </Space>
);

export default App;
