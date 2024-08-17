import React from 'react';
import { BellAlertOutline } from '@metisjs/icons';
import { Badge, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space>
    <Badge dot size="small">
      <BellAlertOutline className="h-5 w-5 text-base" />
    </Badge>
    <Badge dot size="small">
      <a href="#">Link something</a>
    </Badge>
  </Space>
);

export default App;
