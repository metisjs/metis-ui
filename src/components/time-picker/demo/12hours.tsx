import React from 'react';
import type { TimePickerProps } from 'metis-ui';
import { Space, TimePicker } from 'metis-ui';

const onChange: TimePickerProps['onChange'] = (timeString, time) => {
  console.log(timeString, time);
};

const App: React.FC = () => (
  <Space wrap>
    <TimePicker use12Hours onChange={onChange} />
    <TimePicker use12Hours format="h:mm:ss A" onChange={onChange} />
    <TimePicker use12Hours format="h:mm a" onChange={onChange} />
  </Space>
);

export default App;
