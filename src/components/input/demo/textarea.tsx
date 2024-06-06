/**
 * description: 用于多行输入。
 */
import { Input, Space } from 'metis-ui';
import React from 'react';

const { TextArea } = Input;

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <TextArea rows={2} />
    <TextArea rows={3} placeholder="maxLength is 6" maxLength={6} />
    <TextArea rows={4} disabled value="disabled" />
  </Space>
);

export default App;
