import React, { useState } from 'react';
import type { ConfigProviderProps, RadioChangeEvent } from 'metis-ui';
import { DatePicker, Radio, Space } from 'metis-ui';

type SizeType = ConfigProviderProps['componentSize'];

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('middle');

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  return (
    <Space vertical size={12}>
      <Radio.Group value={size} onChange={handleSizeChange}>
        <Radio value="large">Large</Radio>
        <Radio value="middle">middle</Radio>
        <Radio value="small">Small</Radio>
      </Radio.Group>
      <DatePicker size={size} />
      <DatePicker size={size} picker="month" />
      <RangePicker size={size} />
      <DatePicker size={size} picker="week" />
    </Space>
  );
};

export default App;
