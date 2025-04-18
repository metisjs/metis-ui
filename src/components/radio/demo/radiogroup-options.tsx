import React, { useState } from 'react';
import { Radio } from 'metis-ui';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const optionsWithDisabled = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: true },
];

const App: React.FC = () => {
  const [value1, setValue1] = useState('Apple');
  const [value2, setValue2] = useState('Apple');

  const onChange1 = (value: string) => {
    console.log('radio1 checked', value);
    setValue1(value);
  };

  const onChange2 = (value: string) => {
    console.log('radio2 checked', value);
    setValue2(value);
  };

  return (
    <>
      <Radio.Group options={plainOptions} onChange={onChange1} value={value1} />
      <br />
      <Radio.Group options={optionsWithDisabled} onChange={onChange2} value={value2} />
    </>
  );
};

export default App;
