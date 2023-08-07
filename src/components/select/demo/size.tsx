/**
 * description: 三种大小的选择框，当 size 分别为 `large` 和 `small` 时，输入框高度为 `40px` 和 `32px` ，默认高度为 `36px`。
 */
import type { SelectProps } from 'meta-ui';
import { Segmented, Select, Space } from 'meta-ui';
import { SizeType } from 'meta-ui/es/config-provider/SizeContext';
import React, { useState } from 'react';

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

  const handleSizeChange = (val: string) => {
    setSize(val as SizeType);
  };

  return (
    <>
      <Segmented
        value={size}
        options={[
          { label: 'Large', value: 'large' },
          { label: 'Default', value: 'middle' },
          { label: 'Small', value: 'small' },
        ]}
        onChange={handleSizeChange}
      />
      <br />
      <br />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Select
          size={size}
          defaultValue="a1"
          onChange={handleChange}
          style={{ width: 200 }}
          options={options}
          showSearch
        />
        <Select
          mode="multiple"
          size={size}
          placeholder="Please select"
          defaultValue={['a10', 'c12']}
          onChange={handleChange}
          style={{ width: '100%' }}
          options={options}
        />
        <Select
          mode="tags"
          size={size}
          placeholder="Please select"
          defaultValue={['a10', 'c12']}
          onChange={handleChange}
          style={{ width: '100%' }}
          options={options}
        />
      </Space>
    </>
  );
};

export default App;
