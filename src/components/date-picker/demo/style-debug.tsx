import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'metis-ui';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker defaultValue={dayjs()} disabled />
    <DatePicker defaultValue={dayjs()} />
    <DatePicker defaultValue={dayjs()} status="error" />
    <DatePicker multiple defaultValue={[dayjs()]} disabled />
    <DatePicker multiple defaultValue={[dayjs()]} />
    <DatePicker multiple defaultValue={[dayjs()]} status="error" />
    <RangePicker disabled />
    <RangePicker />
    <RangePicker status="error" />
    <RangePicker
      defaultValue={[dayjs('2024-09-03', dateFormat), dayjs('2024-11-22', dateFormat)]}
      disabled={[false, true]}
    />

    <DatePicker variant="filled" defaultValue={dayjs()} disabled />
    <DatePicker variant="filled" defaultValue={dayjs()} />
    <DatePicker variant="filled" defaultValue={dayjs()} status="error" />
    <DatePicker variant="filled" multiple defaultValue={[dayjs()]} disabled />
    <DatePicker variant="filled" multiple defaultValue={[dayjs()]} />
    <DatePicker variant="filled" multiple defaultValue={[dayjs()]} status="error" />
    <RangePicker variant="filled" disabled />
    <RangePicker variant="filled" />
    <RangePicker variant="filled" status="error" />
    <RangePicker
      variant="filled"
      defaultValue={[dayjs('2024-09-03', dateFormat), dayjs('2024-11-22', dateFormat)]}
      disabled={[false, true]}
    />

    <DatePicker variant="borderless" defaultValue={dayjs()} disabled />
    <DatePicker variant="borderless" defaultValue={dayjs()} />
    <DatePicker variant="borderless" defaultValue={dayjs()} status="error" />
    <DatePicker variant="borderless" multiple defaultValue={[dayjs()]} disabled />
    <DatePicker variant="borderless" multiple defaultValue={[dayjs()]} />
    <DatePicker variant="borderless" multiple defaultValue={[dayjs()]} status="error" />
    <RangePicker variant="borderless" disabled />
    <RangePicker variant="borderless" />
    <RangePicker variant="borderless" status="error" />
    <RangePicker
      variant="borderless"
      defaultValue={[dayjs('2024-09-03', dateFormat), dayjs('2024-11-22', dateFormat)]}
      disabled={[false, true]}
    />
  </Space>
);

export default App;
