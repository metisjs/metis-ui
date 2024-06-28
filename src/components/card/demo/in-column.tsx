import { Card } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <div className="flex gap-4">
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
