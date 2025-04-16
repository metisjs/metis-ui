import React from 'react';
import { HeartOutline } from '@metisjs/icons';
import { Rate, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size="middle" block>
    <Rate character={<HeartOutline />} allowHalf />
    <Rate character="A" allowHalf className="text-4xl" />
    <Rate character="好" allowHalf />
  </Space>
);

export default App;
