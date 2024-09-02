import React from 'react';
import { DatePicker, Space } from 'metis-ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space vertical size={12}>
    <Space size={8} block>
      <DatePicker placeholder="Outlined" />
      <RangePicker placeholder={['Outlined', '']} />
    </Space>
    <Space size={8} block>
      <DatePicker placeholder="Filled" variant="filled" />
      <RangePicker placeholder={['Filled', '']} variant="filled" />
    </Space>
    <Space size={8} block>
      <DatePicker placeholder="Borderless" variant="borderless" />
      <RangePicker placeholder={['Borderless', '']} variant="borderless" />
    </Space>
  </Space>
);

export default App;
