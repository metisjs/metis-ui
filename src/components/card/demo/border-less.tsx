import React from 'react';
import { Card } from 'metis-ui';

const App: React.FC = () => (
  <div className="rounded-lg bg-gray-200 p-6 dark:bg-gray-950">
    <Card title="Card title" bordered={false} className="w-75">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </div>
);

export default App;
