import React from 'react';
import { Input, Space } from 'metis-ui';

const { TextArea } = Input;

const App: React.FC = () => (
  <Space vertical className="flex">
    <TextArea rows={2} />
    <TextArea rows={3} placeholder="maxLength is 6" maxLength={6} />
    <TextArea rows={4} disabled value="disabled" />
  </Space>
);

export default App;
