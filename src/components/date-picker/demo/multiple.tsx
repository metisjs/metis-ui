import React from 'react';
import type { DatePickerProps } from 'metis-ui';
import { DatePicker, Space } from 'metis-ui';

const onChange: DatePickerProps<true>['onChange'] = (dateString, date) => {
  console.log(dateString, date);
};

const defaultValue = ['2000-01-01', '2000-01-03', '2000-01-05'];

const App: React.FC = () => (
  <Space vertical size="small" block>
    <DatePicker
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
      size="mini"
    />
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
