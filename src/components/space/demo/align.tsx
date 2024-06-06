import { Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <div className="space-align-container">
    <div className="space-align-block">
      <Space align="center">
        center
        <div className="bg-primary">Primary</div>
        <span className="mock-block">Block</span>
      </Space>
    </div>
    <div className="space-align-block">
      <Space align="start">
        start
        <div>Primary</div>
        <span className="mock-block">Block</span>
      </Space>
    </div>
    <div className="space-align-block">
      <Space align="end">
        end
        <div>Primary</div>
        <span className="mock-block">Block</span>
      </Space>
    </div>
    <div className="space-align-block">
      <Space align="baseline">
        baseline
        <div>Primary</div>
        <span className="mock-block">Block</span>
      </Space>
    </div>
  </div>
);

export default App;
