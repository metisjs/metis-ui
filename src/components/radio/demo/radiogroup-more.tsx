import React, { useState } from 'react';
import { Input, Radio, Space } from 'metis-ui';

const App: React.FC = () => {
  const [value, setValue] = useState(1);

  const onChange = (value: number) => {
    console.log('radio checked', value);
    setValue(value);
  };

  return (
    <Radio.Group onChange={onChange} value={value}>
      <Space vertical>
        <Radio value={1}>Option A</Radio>
        <Radio value={2}>Option B</Radio>
        <Radio value={3}>Option C</Radio>
        <Radio value={4}>
          More...
          {value === 4 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
        </Radio>
      </Space>
    </Radio.Group>
  );
};

export default App;
