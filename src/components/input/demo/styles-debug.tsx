import React from 'react';
import { Input, Space } from 'metis-ui';

const { TextArea } = Input;

const App: React.FC = () => (
  <Space vertical className="flex">
    <Input defaultValue="Outlined" />
    <Input defaultValue="Outlined" disabled status="error" />
    <Input defaultValue="Outlined" status="error" />
    <Input defaultValue="Outlined" addonBefore="http://" addonAfter=".com" />
    <Input
      defaultValue="Outlined"
      addonBefore="http://"
      addonAfter=".com"
      disabled
      status="error"
    />
    <Input defaultValue="Outlined" addonBefore="http://" addonAfter=".com" status="error" />
    <Input defaultValue="Outlined" prefix="￥" suffix="RMB" showCount allowClear maxLength={100} />
    <Input defaultValue="Outlined" prefix="￥" suffix="RMB" disabled status="error" />
    <Input
      defaultValue="Outlined"
      prefix="￥"
      suffix="RMB"
      status="error"
      showCount
      allowClear
      maxLength={100}
    />
    <TextArea defaultValue="Outlined" />
    <TextArea defaultValue="Outlined" showCount allowClear maxLength={100} />
    <TextArea defaultValue="Outlined" disabled status="error" />
    <TextArea defaultValue="Outlined" status="error" />
    <Input
      defaultValue="Outlined"
      addonBefore="http://"
      addonAfter=".com"
      prefix="￥"
      suffix="RMB"
    />
    <Input
      defaultValue="Outlined"
      addonBefore="http://"
      addonAfter=".com"
      disabled
      status="error"
      prefix="￥"
      suffix="RMB"
    />
    <Input
      defaultValue="Outlined"
      addonBefore="http://"
      addonAfter=".com"
      status="error"
      prefix="￥"
      suffix="RMB"
    />

    <Input defaultValue="Filled" variant="filled" />
    <Input defaultValue="Filled" variant="filled" disabled status="error" />
    <Input defaultValue="Filled" variant="filled" status="error" />
    <Input defaultValue="Filled" variant="filled" addonBefore="http://" addonAfter=".com" />
    <Input
      defaultValue="Filled"
      variant="filled"
      addonBefore="http://"
      addonAfter=".com"
      disabled
      status="error"
    />
    <Input
      defaultValue="Filled"
      variant="filled"
      addonBefore="http://"
      addonAfter=".com"
      status="error"
    />
    <Input
      defaultValue="Filled"
      variant="filled"
      prefix="￥"
      suffix="RMB"
      showCount
      allowClear
      maxLength={100}
    />
    <Input
      defaultValue="Filled"
      variant="filled"
      prefix="￥"
      suffix="RMB"
      disabled
      status="error"
    />
    <Input defaultValue="Filled" variant="filled" prefix="￥" suffix="RMB" status="error" />
    <Input
      defaultValue="Filled"
      variant="filled"
      addonBefore="http://"
      addonAfter=".com"
      prefix="￥"
      suffix="RMB"
    />
    <Input
      defaultValue="Filled"
      variant="filled"
      addonBefore="http://"
      addonAfter=".com"
      disabled
      status="error"
      prefix="￥"
      suffix="RMB"
    />
    <Input
      defaultValue="Filled"
      variant="filled"
      addonBefore="http://"
      addonAfter=".com"
      status="error"
      prefix="￥"
      suffix="RMB"
    />
    <TextArea defaultValue="Filled" variant="filled" />
    <TextArea defaultValue="Filled" variant="filled" showCount allowClear maxLength={100} />
    <TextArea defaultValue="Filled" variant="filled" disabled status="error" />
    <TextArea defaultValue="Filled" variant="filled" status="error" />

    <Input defaultValue="Borderless" variant="borderless" />
    <Input defaultValue="Borderless" variant="borderless" disabled status="error" />
    <Input defaultValue="Borderless" variant="borderless" status="error" />
    <Input defaultValue="Borderless" variant="borderless" addonBefore="http://" addonAfter=".com" />
    <Input
      defaultValue="Borderless"
      variant="borderless"
      addonBefore="http://"
      addonAfter=".com"
      disabled
      status="error"
    />
    <Input
      defaultValue="Borderless"
      variant="borderless"
      addonBefore="http://"
      addonAfter=".com"
      status="error"
    />
    <Input
      defaultValue="Borderless"
      variant="borderless"
      prefix="￥"
      suffix="RMB"
      showCount
      allowClear
      maxLength={100}
    />
    <Input
      defaultValue="Borderless"
      variant="borderless"
      prefix="￥"
      suffix="RMB"
      disabled
      status="error"
    />
    <Input defaultValue="Borderless" variant="borderless" prefix="￥" suffix="RMB" status="error" />
    <Input
      defaultValue="Borderless"
      variant="borderless"
      addonBefore="http://"
      addonAfter=".com"
      prefix="￥"
      suffix="RMB"
    />
    <Input
      defaultValue="Borderless"
      variant="borderless"
      addonBefore="http://"
      addonAfter=".com"
      disabled
      status="error"
      prefix="￥"
      suffix="RMB"
    />
    <Input
      defaultValue="Borderless"
      variant="borderless"
      addonBefore="http://"
      addonAfter=".com"
      status="error"
      prefix="￥"
      suffix="RMB"
    />
    <TextArea defaultValue="Borderless" variant="borderless" />
    <TextArea defaultValue="Borderless" variant="borderless" showCount allowClear maxLength={100} />
    <TextArea defaultValue="Borderless" variant="borderless" disabled status="error" />
    <TextArea defaultValue="Borderless" variant="borderless" status="error" />
  </Space>
);

export default App;
