import React from 'react';
import type { DatePickerProps } from 'metis-ui';
import { DatePicker, Space } from 'metis-ui';

const onChange: DatePickerProps['onChange'] = (dateString, date) => {
  console.log(dateString, date);
};

const App: React.FC = () => (
  <Space vertical>
    <DatePicker
      format={{
        format: 'YYYY-MM-DD',
        type: 'mask',
      }}
      onChange={onChange}
    />
    <DatePicker
      format={{
        format: 'YYYY-MM-DD HH:mm:ss',
        type: 'mask',
      }}
      onChange={onChange}
    />
  </Space>
);

export default App;
