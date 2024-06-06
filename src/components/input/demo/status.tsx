/**
 * description: 使用 `status` 为 Input 添加状态，可选 `error` 或者 `warning`。
 */
import { ClockOutline } from '@metisjs/icons';
import { Input, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Input status="error" placeholder="Error" />
    <Input status="warning" placeholder="Warning" />
    <Input status="error" prefix={<ClockOutline />} placeholder="Error with prefix" />
    <Input status="warning" prefix={<ClockOutline />} placeholder="Warning with prefix" />
    <Input.TextArea status="error" placeholder="Error" />
    <Input.TextArea status="warning" placeholder="Warning" />
  </Space>
);

export default App;
