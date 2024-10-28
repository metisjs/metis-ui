import React, { useState } from 'react';
import { DatePicker, Segmented, Space } from 'metis-ui';
import type { SizeType } from 'metis-ui/es/config-provider/SizeContext';

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('middle');

  return (
    <Space vertical size={12}>
      <Segmented
        value={size}
        options={[
          { label: 'Large', value: 'large' },
          { label: 'Default', value: 'middle' },
          { label: 'Small', value: 'small' },
          { label: 'Mini', value: 'mini' },
        ]}
        onChange={setSize}
      />
      <DatePicker size={size} />
      <DatePicker size={size} picker="month" />
      <RangePicker size={size} />
      <DatePicker size={size} picker="week" />
    </Space>
  );
};

export default App;
