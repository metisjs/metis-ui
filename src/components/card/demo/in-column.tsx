import React from 'react';
import { Card } from 'metis-ui';

const App: React.FC = () => (
  <div className="flex gap-4 rounded-lg bg-gray-200 p-6 dark:bg-gray-950">
    <div className="basis-1/3">
      <Card title="Card title" bordered={false}>
        Card content
      </Card>
    </div>
    <div className="basis-1/3">
      <Card title="Card title" bordered={false}>
        Card content
      </Card>
    </div>
    <div className="basis-1/3">
      <Card title="Card title" bordered={false}>
        Card content
      </Card>
    </div>
  </div>
);

export default App;
