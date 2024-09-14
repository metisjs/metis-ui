import React from 'react';
import type { InputNumberProps } from 'metis-ui';
import { InputNumber, Space } from 'metis-ui';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => (
  <Space wrap>
    <InputNumber size="large" min={1} max={100000} defaultValue={3} onChange={onChange} />
    <InputNumber min={1} max={100000} defaultValue={3} onChange={onChange} />
    <InputNumber size="small" min={1} max={100000} defaultValue={3} onChange={onChange} />
    <InputNumber size="mini" min={1} max={100000} defaultValue={3} onChange={onChange} />
  </Space>
);

export default App;
