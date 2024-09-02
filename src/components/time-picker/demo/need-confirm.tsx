import React from 'react';
import type { TimePickerProps } from 'metis-ui';
import { TimePicker } from 'metis-ui';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker onChange={onChange} needConfirm />;

export default App;
