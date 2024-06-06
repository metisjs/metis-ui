/**
 * description: 试下复制 `露西,杰克` 并粘贴到输入框里。只在 tags 和 multiple 模式下可用。
 */
import type { SelectProps } from 'metis-ui';
import { Select } from 'metis-ui';
import React from 'react';

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Select
    mode="tags"
    style={{ width: '100%' }}
    onChange={handleChange}
    tokenSeparators={[',']}
    options={options}
  />
);

export default App;
