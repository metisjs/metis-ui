import React from 'react';
import type { DatePickerProps } from 'metis-ui';
import { DatePicker, Space } from 'metis-ui';

const onChange: DatePickerProps['onChange'] = (dateString, date) => {
  console.log(dateString, date);
};

const App: React.FC = () => (
  <Space vertical>
    <DatePicker onChange={onChange} />
    <DatePicker onChange={onChange} picker="week" />
    <DatePicker onChange={onChange} picker="month" />
    <DatePicker onChange={onChange} picker="quarter" />
    <DatePicker onChange={onChange} picker="year" />
  </Space>
);

export default App;
