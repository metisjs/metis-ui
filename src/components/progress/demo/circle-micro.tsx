import React from 'react';
import { Progress, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="small" block>
    <Progress
      type="circle"
      trailColor="#e6f4ff"
      percent={60}
      strokeWidth={20}
      size={14}
      format={(number) => `进行中，已完成${number}%`}
    />
    <span>代码发布</span>
  </Space>
);

export default App;
