import React from 'react';
import { ClockOutline } from '@metisjs/icons';
import { Input, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical block>
    <Input status="error" placeholder="Error" />
    <Input status="warning" placeholder="Warning" />
    <Input status="error" prefix={<ClockOutline />} placeholder="Error with prefix" />
    <Input status="warning" prefix={<ClockOutline />} placeholder="Warning with prefix" />
    <Input.TextArea status="error" placeholder="Error" />
    <Input.TextArea status="warning" placeholder="Warning" />
  </Space>
);

export default App;
