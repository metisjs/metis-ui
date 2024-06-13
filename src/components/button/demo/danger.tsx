import { Button, Space } from 'metis-ui';
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
