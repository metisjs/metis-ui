import React from 'react';
import { Button, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="middle" wrap>
    <Button type="primary" autoInsertSpace={false}>
      确定
    </Button>
    <Button type="primary" autoInsertSpace>
      确定
    </Button>
  </Space>
);

export default App;
