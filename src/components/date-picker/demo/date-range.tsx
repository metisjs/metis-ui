import React from 'react';
import { DatePicker } from 'metis-ui';

const App: React.FC = () => (
  <DatePicker defaultValue="2019-09-03" minDate="2019-08-01" maxDate="2020-10-31" />
);

export default App;
