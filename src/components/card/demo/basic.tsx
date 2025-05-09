import React from 'react';
import { Card, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size={16}>
    <Card title="Default size card" extra={<a href="#">More</a>} className="w-75">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card size="small" title="Small size card" extra={<a href="#">More</a>} className="w-75">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </Space>
);

export default App;
