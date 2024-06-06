/**
 * description: 带移除图标的输入框，点击图标删除所有内容。
 */
import { EyeDropperSolid } from '@metisjs/icons';
import { Input, Space } from 'meta-ui';
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
