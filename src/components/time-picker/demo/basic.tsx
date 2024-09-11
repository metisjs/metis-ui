import React from 'react';
import type { TimePickerProps } from 'metis-ui';
import { TimePicker } from 'metis-ui';

const onChange: TimePickerProps['onChange'] = (timeString, time) => {
  console.log(timeString, time);
};

const App: React.FC = () => <TimePicker onChange={onChange} defaultOpenValue="00:00:00" />;

export default App;
