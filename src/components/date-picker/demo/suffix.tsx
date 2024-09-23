import React from 'react';
import { FaceSmileOutline } from '@metisjs/icons';
import type { Dayjs } from 'dayjs';
import { DatePicker, Space } from 'metis-ui';

const smileIcon = <FaceSmileOutline />;
const { RangePicker } = DatePicker;

const onChange = (dateString: string, date: Dayjs | null) => {
  console.log(dateString, date);
};

const onRangeChange = (
  dateStrings: [string, string],
  dates: [start: Dayjs | null, end: Dayjs | null] | null,
) => {
  console.log(dateStrings, dates);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker suffixIcon={smileIcon} onChange={onChange} />
    <DatePicker suffixIcon={smileIcon} onChange={onChange} picker="month" />
    <RangePicker suffixIcon={smileIcon} onChange={onRangeChange} />
    <DatePicker suffixIcon={smileIcon} onChange={onChange} picker="week" />
    <DatePicker suffixIcon="ab" onChange={onChange} />
    <DatePicker suffixIcon="ab" onChange={onChange} picker="month" />
    <RangePicker suffixIcon="ab" onChange={onRangeChange} />
    <DatePicker suffixIcon="ab" onChange={onChange} picker="week" />
  </Space>
);

export default App;
