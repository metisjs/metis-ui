import React from 'react';
import { Space, TimePicker } from 'metis-ui';

const { RangePicker } = TimePicker;

const App: React.FC = () => (
  <Space vertical block size={12}>
    <Space size={8}>
      <TimePicker placeholder="Filled" />
      <RangePicker placeholder={['Filled', '']} />
    </Space>
    <Space size={8}>
      <TimePicker variant="filled" placeholder="Filled" />
      <RangePicker variant="filled" placeholder={['Filled', '']} />
    </Space>
    <Space size={8}>
      <TimePicker variant="borderless" placeholder="Borderless" />
      <RangePicker variant="borderless" placeholder={['Borderless', '']} />
    </Space>
  </Space>
);

export default App;
