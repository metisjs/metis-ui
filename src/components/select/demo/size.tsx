import React, { useState } from 'react';
import type { SelectProps } from 'metis-ui';
import { Segmented, Select, Space } from 'metis-ui';
import type { SizeType } from 'metis-ui/es/config-provider/SizeContext';

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const handleChange = (value: string | string[]) => {
  console.log(`Selected: ${value}`);
};

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('middle');

  return (
    <>
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
      <br />
      <br />
      <Space vertical block>
        <Select
          size={size}
          defaultValue="a1"
          onChange={handleChange}
          className="w-50"
          options={options}
          showSearch
        />
        <Select
          mode="multiple"
          size={size}
          placeholder="Please select"
          defaultValue={['a10', 'c12']}
          onChange={handleChange}
          className="w-full"
          options={options}
        />
        <Select
          mode="tags"
          size={size}
          placeholder="Please select"
          defaultValue={['a10', 'c12']}
          onChange={handleChange}
          className="w-full"
          options={options}
        />
      </Space>
    </>
  );
};

export default App;
