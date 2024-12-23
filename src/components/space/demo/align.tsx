import React from 'react';
import { Button, Space } from 'metis-ui';

const App: React.FC = () => (
  <div className="flex flex-wrap items-start">
    <div className="mx-2 my-1 flex-none border border-primary p-1">
      <Space align="center">
        center
        <Button type="primary">Primary</Button>
        <span className="inline-block bg-fill-secondary px-2 pb-4 pt-8">Block</span>
      </Space>
    </div>
    <div className="mx-2 my-1 flex-none border border-primary p-1">
      <Space align="start">
        start
        <Button type="primary">Primary</Button>
        <span className="inline-block bg-fill-secondary px-2 pb-4 pt-8">Block</span>
      </Space>
    </div>
    <div className="mx-2 my-1 flex-none border border-primary p-1">
      <Space align="end">
        end
        <Button type="primary">Primary</Button>
        <span className="inline-block bg-fill-secondary px-2 pb-4 pt-8">Block</span>
      </Space>
    </div>
    <div className="mx-2 my-1 flex-none border border-primary p-1">
      <Space align="baseline">
        baseline
        <Button type="primary">Primary</Button>
        <span className="inline-block bg-fill-secondary px-2 pb-4 pt-8">Block</span>
      </Space>
    </div>
  </div>
);

export default App;
