import React from 'react';
import type { TimePickerProps } from 'metis-ui';
import { TimePicker } from 'metis-ui';

const onChange: TimePickerProps['onChange'] = (timeString, time) => {
  console.log(timeString, time);
};

const App: React.FC = () => <TimePicker onChange={onChange} changeOnScroll needConfirm={false} />;

export default App;
