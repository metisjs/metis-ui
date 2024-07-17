import { InputNumber, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical size={12}>
    <Space size={12}>
      <InputNumber placeholder="Filled" variant="filled" />
      <InputNumber placeholder="Filled" variant="filled" disabled />
      <InputNumber placeholder="Filled" variant="filled" status="error" />
    </Space>
    <Space size={12}>
      <InputNumber prefix="$" placeholder="Filled" variant="filled" />
      <InputNumber prefix="$" placeholder="Filled" variant="filled" disabled />
      <InputNumber prefix="$" placeholder="Filled" variant="filled" status="error" />
    </Space>
    <Space size={12}>
      <InputNumber addonBefore="http://" addonAfter=".com" placeholder="Filled" variant="filled" />
      <InputNumber
        addonBefore="http://"
        addonAfter=".com"
        placeholder="Filled"
        variant="filled"
        disabled
      />
      <InputNumber
        addonBefore="http://"
        addonAfter=".com"
        placeholder="Filled"
        variant="filled"
        status="error"
      />
    </Space>
    <Space size={12}>
      <InputNumber addonAfter=".com" placeholder="Filled" variant="filled" />
      <InputNumber addonAfter=".com" placeholder="Filled" variant="filled" disabled />
      <InputNumber addonAfter=".com" placeholder="Filled" variant="filled" status="error" />
    </Space>
    <Space size={12}>
      <InputNumber addonBefore="http://" placeholder="Filled" variant="filled" />
      <InputNumber addonBefore="http://" placeholder="Filled" variant="filled" disabled />
      <InputNumber addonBefore="http://" placeholder="Filled" variant="filled" status="error" />
    </Space>
  </Space>
);

export default App;
