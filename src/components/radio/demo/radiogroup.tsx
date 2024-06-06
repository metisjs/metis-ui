/**
 * description: 一组互斥的 Radio 配合使用。
 */
import type { RadioChangeEvent } from 'metis-ui';
import { Radio } from 'metis-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
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
