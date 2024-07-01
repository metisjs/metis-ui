import { Progress, Space, Tooltip } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space size="small" vertical block>
    <Tooltip title="3 done / 3 in progress / 4 to do">
      <Progress percent={60} success={{ percent: 30 }} />
    </Tooltip>
    <Space size="small" wrap block>
      <Tooltip title="3 done / 3 in progress / 4 to do">
        <Progress percent={60} success={{ percent: 30 }} type="circle" />
      </Tooltip>
      <Tooltip title="3 done / 3 in progress / 4 to do">
        <Progress percent={60} success={{ percent: 30 }} type="dashboard" />
      </Tooltip>
    </Space>
  </Space>
);

export default App;
