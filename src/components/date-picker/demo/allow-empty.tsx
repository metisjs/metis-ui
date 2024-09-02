import React from 'react';
import { DatePicker } from 'metis-ui';

const App: React.FC = () => (
  <DatePicker.RangePicker
    placeholder={['', 'Till Now']}
    allowEmpty={[false, true]}
    onChange={(date, dateString) => {
      console.log(date, dateString);
    }}
  />
);

export default App;
