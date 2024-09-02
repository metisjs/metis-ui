import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, Space } from 'metis-ui';

const defaultValue = new Array(10).fill(0).map((_, index) => dayjs('2000-01-01').add(index, 'day'));

const App: React.FC = () => (
  <Space vertical size="small">
    <DatePicker multiple placeholder="Bamboo" />
    <DatePicker multiple defaultValue={defaultValue} size="small" />
    <DatePicker multiple defaultValue={defaultValue} />
    <DatePicker multiple defaultValue={defaultValue} size="large" />
  </Space>
);

export default App;
