import React, { useState } from 'react';
import { Radio } from 'metis-ui';

const App: React.FC = () => {
  const [value, setValue] = useState(1);

  const onChange = (value: number) => {
    console.log('radio checked', value);
    setValue(value);
  };

  return (
    <Radio.Group onChange={onChange} value={value}>
      <Radio value={1}>A</Radio>
      <Radio value={2}>B</Radio>
      <Radio value={3}>C</Radio>
      <Radio value={4}>D</Radio>
    </Radio.Group>
  );
};

export default App;
