import { EyeDropperSolid } from '@metisjs/icons';
import { Input, Space } from 'metis-ui';
import React from 'react';

const { TextArea } = Input;

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log(e);
};

const App: React.FC = () => (
  <Space direction="vertical" className="flex">
    <Input
      placeholder="input with clear icon"
      allowClear
      onChange={onChange}
      suffix={<EyeDropperSolid />}
    />
    <TextArea placeholder="textarea with clear icon" allowClear onChange={onChange} />
  </Space>
);

export default App;
