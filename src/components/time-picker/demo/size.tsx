import React from 'react';
import dayjs from 'dayjs';
import { Space, TimePicker } from 'metis-ui';

const App: React.FC = () => (
  <Space wrap>
    <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} size="large" />
    <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} />
    <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} size="small" />
    <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} size="mini" />
  </Space>
);

export default App;
