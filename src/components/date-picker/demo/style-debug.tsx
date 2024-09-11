import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, Space } from 'metis-ui';

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker defaultValue={dayjs()} disabled />
    <DatePicker defaultValue={dayjs()} />
    <DatePicker defaultValue={dayjs()} status="error" />
    <DatePicker multiple defaultValue={[dayjs()]} disabled />
    <DatePicker multiple defaultValue={[dayjs()]} />
    <DatePicker multiple defaultValue={[dayjs()]} status="error" />
    <RangePicker defaultValue={[dayjs(), dayjs()]} disabled />
    <RangePicker />
    <RangePicker status="error" />
    <RangePicker defaultValue={['2024-09-03', '2024-11-22']} disabled={[false, true]} />

    <DatePicker variant="filled" defaultValue={dayjs()} disabled />
    <DatePicker variant="filled" defaultValue={dayjs()} />
    <DatePicker variant="filled" defaultValue={dayjs()} status="error" />
    <DatePicker variant="filled" multiple defaultValue={[dayjs()]} disabled />
    <DatePicker variant="filled" multiple defaultValue={[dayjs()]} />
    <DatePicker variant="filled" multiple defaultValue={[dayjs()]} status="error" />
    <RangePicker variant="filled" defaultValue={[dayjs(), dayjs()]} disabled />
    <RangePicker variant="filled" />
    <RangePicker variant="filled" status="error" />
    <RangePicker
      variant="filled"
      defaultValue={['2024-09-03', '2024-11-22']}
      disabled={[false, true]}
    />

    <DatePicker variant="borderless" defaultValue={dayjs()} disabled />
    <DatePicker variant="borderless" defaultValue={dayjs()} />
    <DatePicker variant="borderless" defaultValue={dayjs()} status="error" />
    <DatePicker variant="borderless" multiple defaultValue={[dayjs()]} disabled />
    <DatePicker variant="borderless" multiple defaultValue={[dayjs()]} />
    <DatePicker variant="borderless" multiple defaultValue={[dayjs()]} status="error" />
    <RangePicker variant="borderless" defaultValue={[dayjs(), dayjs()]} disabled />
    <RangePicker variant="borderless" />
    <RangePicker variant="borderless" status="error" />
    <RangePicker
      variant="borderless"
      defaultValue={['2024-09-03', '2024-11-22']}
      disabled={[false, true]}
    />
  </Space>
);

export default App;
