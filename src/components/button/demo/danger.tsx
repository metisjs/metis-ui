/**
 * description: 危险成为一种按钮属性而不是按钮类型。
 */
import { Button, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space>
    <Button type="primary" danger>
      Primary
    </Button>
    <Button danger>Default</Button>
    <Button type="text" danger>
      Text
    </Button>
    <Button type="link" danger>
      Link
    </Button>
  </Space>
);

export default App;
