import { InputNumber, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Space vertical size={12}>
    <InputNumber placeholder="Outlined" />
    <InputNumber placeholder="Outlined" disabled status="error" />
    <InputNumber placeholder="Outlined" status="error" />
    <InputNumber prefix="$" placeholder="Outlined" />
    <InputNumber prefix="$" placeholder="Outlined" disabled status="error" />
    <InputNumber prefix="$" placeholder="Outlined" status="error" />
    <InputNumber addonBefore="http://" addonAfter=".com" placeholder="Outlined" />
    <InputNumber
      addonBefore="http://"
      addonAfter=".com"
      placeholder="Outlined"
      disabled
      status="error"
    />
    <InputNumber addonBefore="http://" addonAfter=".com" placeholder="Outlined" status="error" />
    <InputNumber addonAfter=".com" prefix="$" placeholder="Outlined" />
    <InputNumber addonAfter=".com" prefix="$" placeholder="Outlined" disabled status="error" />
    <InputNumber addonAfter=".com" prefix="$" placeholder="Outlined" status="error" />

    <InputNumber placeholder="Filled" variant="filled" />
    <InputNumber placeholder="Filled" variant="filled" disabled status="error" />
    <InputNumber placeholder="Filled" variant="filled" status="error" />
    <InputNumber prefix="$" placeholder="Filled" variant="filled" />
    <InputNumber prefix="$" placeholder="Filled" variant="filled" disabled status="error" />
    <InputNumber prefix="$" placeholder="Filled" variant="filled" status="error" />
    <InputNumber addonBefore="http://" addonAfter=".com" placeholder="Filled" variant="filled" />
    <InputNumber
      addonBefore="http://"
      addonAfter=".com"
      placeholder="Filled"
      variant="filled"
      disabled
      status="error"
    />
    <InputNumber
      addonBefore="http://"
      addonAfter=".com"
      placeholder="Filled"
      variant="filled"
      status="error"
    />
    <InputNumber addonAfter=".com" prefix="$" placeholder="Filled" variant="filled" />
    <InputNumber
      addonAfter=".com"
      prefix="$"
      placeholder="Filled"
      variant="filled"
      disabled
      status="error"
    />
    <InputNumber
      addonAfter=".com"
      prefix="$"
      placeholder="Filled"
      variant="filled"
      status="error"
    />

    <InputNumber placeholder="Borderless" variant="borderless" />
    <InputNumber placeholder="Borderless" variant="borderless" disabled status="error" />
    <InputNumber placeholder="Borderless" variant="borderless" status="error" />
    <InputNumber prefix="$" placeholder="Borderless" variant="borderless" />
    <InputNumber prefix="$" placeholder="Borderless" variant="borderless" disabled status="error" />
    <InputNumber prefix="$" placeholder="Borderless" variant="borderless" status="error" />
    <InputNumber
      addonBefore="http://"
      addonAfter=".com"
      placeholder="Borderless"
      variant="borderless"
    />
    <InputNumber
      addonBefore="http://"
      addonAfter=".com"
      placeholder="Borderless"
      variant="borderless"
      disabled
      status="error"
    />
    <InputNumber
      addonBefore="http://"
      addonAfter=".com"
      placeholder="Borderless"
      variant="borderless"
      status="error"
    />
    <InputNumber addonAfter=".com" prefix="$" placeholder="Borderless" variant="borderless" />
    <InputNumber
      addonAfter=".com"
      prefix="$"
      placeholder="Borderless"
      variant="borderless"
      disabled
      status="error"
    />
    <InputNumber
      addonAfter=".com"
      prefix="$"
      placeholder="Borderless"
      variant="borderless"
      status="error"
    />
  </Space>
);

export default App;
