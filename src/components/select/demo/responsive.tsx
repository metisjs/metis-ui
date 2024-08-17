import React, { useState } from 'react';
import type { SelectPropsWithOptions } from 'metis-ui';
import { Select, Space } from 'metis-ui';

interface ItemProps {
  label: string;
  value: string;
}

const options: ItemProps[] = [];

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i;
  options.push({
    label: `Long Label: ${value}`,
    value,
  });
}

const App: React.FC = () => {
  const [value, setValue] = useState(['a10', 'c12', 'h17', 'j19', 'k20']);

  const selectProps: SelectPropsWithOptions = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options,
    onChange: (newValue: string[]) => {
      setValue(newValue);
    },
    placeholder: 'Select Item...',
    maxTagCount: 'responsive',
  };

  return (
    <Space vertical block>
      <Select {...selectProps} />
      <Select {...selectProps} disabled />
    </Space>
  );
};

export default App;
