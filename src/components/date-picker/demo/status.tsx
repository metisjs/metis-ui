import React from 'react';
import { DatePicker, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical className="w-full">
    <DatePicker status="error" className="w-full" />
    <DatePicker status="warning" className="w-full" />
    <DatePicker.RangePicker status="error" className="w-full" />
    <DatePicker.RangePicker status="warning" className="w-full" />
  </Space>
);

export default App;
