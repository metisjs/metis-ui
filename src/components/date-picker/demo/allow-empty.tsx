import React from 'react';
import { DatePicker } from 'metis-ui';

const App: React.FC = () => (
  <DatePicker.RangePicker
    placeholder={['', 'Till Now']}
    allowEmpty={[false, true]}
    onChange={(dateString, date) => {
      console.log(dateString, date);
    }}
  />
);

export default App;
