/**
 * description: 展示字数提示。
 */
import { Input, Space } from 'metis-ui';
import React from 'react';

const { TextArea } = Input;

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log('Change:', e.target.value);
};

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <Input showCount maxLength={20} onChange={onChange} />
    <TextArea showCount maxLength={1000} onChange={onChange} />
  </Space>
);

export default App;
