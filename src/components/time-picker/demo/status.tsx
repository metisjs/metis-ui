import React from 'react';
import { Space, TimePicker } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical>
    <TimePicker status="error" />
    <TimePicker status="warning" />
    <TimePicker.RangePicker status="error" />
    <TimePicker.RangePicker status="warning" />
  </Space>
);

export default App;
