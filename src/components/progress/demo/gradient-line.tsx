import type { ProgressProps } from 'metis-ui';
import { Progress, Space } from 'metis-ui';
import React from 'react';

const twoColors: ProgressProps['strokeColor'] = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#87d068',
  '50%': '#ffe58f',
  '100%': '#ffccc7',
};

const App: React.FC = () => (
  <Space vertical size="middle" block>
    <Progress percent={99.9} strokeColor={twoColors} />
    <Progress percent={50} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} />
    <Space size="small" wrap block>
      <Progress type="circle" percent={90} strokeColor={twoColors} />
      <Progress type="circle" percent={100} strokeColor={twoColors} />
      <Progress type="circle" percent={93} strokeColor={conicColors} />
    </Space>
    <Space size="small" wrap block>
      <Progress type="dashboard" percent={90} strokeColor={twoColors} />
      <Progress type="dashboard" percent={100} strokeColor={twoColors} />
      <Progress type="dashboard" percent={93} strokeColor={conicColors} />
    </Space>
  </Space>
);

export default App;
