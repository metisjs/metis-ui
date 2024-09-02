import React from 'react';
import type { DatePickerProps } from 'metis-ui';
import { DatePicker } from 'metis-ui';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const App: React.FC = () => <DatePicker onChange={onChange} needConfirm />;

export default App;
