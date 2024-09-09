import React from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { DatePickerProps } from 'metis-ui';
import { DatePicker, Space } from 'metis-ui';

const onChange: DatePickerProps<Dayjs, true>['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const defaultValue = [dayjs('2000-01-01'), dayjs('2000-01-03'), dayjs('2000-01-05')];

const App: React.FC = () => (
  <Space vertical size="small" block>
    <DatePicker
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
      size="small"
    />
    <DatePicker multiple onChange={onChange} maxTagCount="responsive" defaultValue={defaultValue} />
    <DatePicker
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
      size="large"
    />
  </Space>
);

export default App;
