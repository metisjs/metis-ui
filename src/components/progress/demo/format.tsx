import React from 'react';
import { Progress, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space size="small" wrap block>
    <Progress type="circle" percent={75} format={(percent) => `${percent} Days`} />
    <Progress type="circle" percent={100} format={() => 'Done'} />
  </Space>
);

export default App;
