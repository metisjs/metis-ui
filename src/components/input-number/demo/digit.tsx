import React from 'react';
import type { InputNumberProps } from 'metis-ui';
import { InputNumber } from 'metis-ui';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => (
  <InputNumber<string>
    className="w-52"
    defaultValue="1"
    min="0"
    max="10"
    step="0.00000000000001"
    onChange={onChange}
    stringMode
  />
);

export default App;
