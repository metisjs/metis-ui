import React from 'react';
import { Input, Space } from 'metis-ui';

const { TextArea } = Input;

const onChange = (value: string) => {
  console.log('Change:', value);
};

const App: React.FC = () => (
  <Space vertical className="flex">
    <Input showCount maxLength={20} onChange={onChange} />
    <TextArea showCount maxLength={1000} onChange={onChange} />
  </Space>
);

export default App;
