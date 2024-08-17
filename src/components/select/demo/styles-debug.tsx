import React from 'react';
import { Select, Space } from 'metis-ui';

const options = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'yiminghe', label: 'Yiminghe' },
  { value: 'disabled', label: 'Disabled', disabled: true },
];

const App: React.FC = () => (
  <Space vertical size={12} block>
    <Select options={options} defaultValue="lucy" placeholder="Outlined" />
    <Select options={options} defaultValue="lucy" placeholder="Outlined" allowClear showSearch />
    <Select options={options} defaultValue="lucy" placeholder="Outlined" disabled status="error" />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      status="error"
      showSearch
    />
    <Select options={options} defaultValue="lucy" placeholder="Outlined" mode="multiple" />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      allowClear
      showSearch
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      disabled
      status="error"
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      status="error"
      mode="multiple"
    />

    <Select options={options} defaultValue="lucy" placeholder="Outlined" variant="filled" />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="filled"
      allowClear
      showSearch
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="filled"
      disabled
      status="error"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="filled"
      status="error"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="filled"
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="filled"
      allowClear
      showSearch
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="filled"
      disabled
      status="error"
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="filled"
      status="error"
      mode="multiple"
    />

    <Select options={options} defaultValue="lucy" placeholder="Outlined" variant="borderless" />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="borderless"
      allowClear
      showSearch
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="borderless"
      disabled
      status="error"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="borderless"
      status="error"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="borderless"
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="borderless"
      allowClear
      showSearch
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="borderless"
      disabled
      status="error"
      mode="multiple"
    />
    <Select
      options={options}
      defaultValue="lucy"
      placeholder="Outlined"
      variant="borderless"
      status="error"
      mode="multiple"
    />
  </Space>
);

export default App;
