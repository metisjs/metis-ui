import React from 'react';
import { DatePicker, Space } from 'metis-ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker defaultValue="2015-06-06" disabled />
    <DatePicker picker="month" defaultValue="2015-06" disabled />
    <RangePicker defaultValue={['2015-06-06', '2015-06-06']} disabled />
    <RangePicker defaultValue={['2019-09-03', '2019-11-22']} disabled={[false, true]} />
    <DatePicker defaultValue="2019-09-03" minDate="2019-06-01" maxDate="2020-06-30" />
  </Space>
);

export default App;
