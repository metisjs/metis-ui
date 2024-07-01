import { Progress, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space size="small" wrap block>
    <Progress type="circle" percent={75} format={(percent) => `${percent} Days`} />
    <Progress type="circle" percent={100} format={() => 'Done'} />
  </Space>
);

export default App;
