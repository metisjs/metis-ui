import { ClockOutline } from '@metisjs/icons';
import { InputNumber, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical block>
    <InputNumber status="error" className="w-full" />
    <InputNumber status="warning" className="w-full" />
    <InputNumber status="error" className="w-full" prefix={<ClockOutline />} />
    <InputNumber status="warning" className="w-full" prefix={<ClockOutline />} />
  </Space>
);

export default App;
