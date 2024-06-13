import { Input, Space } from 'metis-ui';
import React from 'react';

const { TextArea } = Input;

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <Input placeholder="Unbordered" bordered={false} />
    <Input placeholder="Unbordered" bordered={false} size="large" />
    <TextArea placeholder="Unbordered" bordered={false} />
    <TextArea placeholder="Unbordered" bordered={false} allowClear />
    <Input placeholder="Unbordered" bordered={false} allowClear />
    <Input prefix="￥" suffix="RMB" bordered={false} />
    <Input prefix="￥" suffix="RMB" disabled bordered={false} />
    <TextArea allowClear style={{ border: '2px solid #000' }} />
  </Space>
);

export default App;
