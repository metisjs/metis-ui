import { Select, Space } from 'metis-ui';
import React from 'react';

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Space wrap>
    <Select
      defaultValue="lucy"
      style={{ width: 160 }}
      onChange={handleChange}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}
    />
    <Select
      defaultValue="lucy"
      style={{ width: 160 }}
      disabled
      options={[{ value: 'lucy', label: 'Lucy' }]}
    />
    <Select
      defaultValue="lucy"
      style={{ width: 160 }}
      loading
      options={[{ value: 'lucy', label: 'Lucy' }]}
    />
    <Select
      defaultValue="lucy"
      style={{ width: 160 }}
      allowClear
      options={[{ value: 'lucy', label: 'Lucy' }]}
    />
  </Space>
);

export default App;
