import { Button, Space } from 'metis-ui';
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
