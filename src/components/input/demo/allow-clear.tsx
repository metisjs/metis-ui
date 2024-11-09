import React from 'react';
import { EyeDropperSolid } from '@metisjs/icons';
import { Input, Space } from 'metis-ui';

const { TextArea } = Input;

const onChange = (value: string) => {
  console.log(value);
};

const App: React.FC = () => (
  <Space vertical className="flex">
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
