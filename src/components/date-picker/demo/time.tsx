import React from 'react';
import type { Dayjs } from 'dayjs';
import { DatePicker, Space } from 'metis-ui';

const { RangePicker } = DatePicker;

const onOk = (value: Dayjs | [Dayjs | null, Dayjs | null]) => {
  console.log('onOk: ', value);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker
      showTime
      onChange={(value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }}
      onOk={onOk}
    />
    <RangePicker
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
      onChange={(value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }}
      onOk={onOk}
    />
  </Space>
);

export default App;
