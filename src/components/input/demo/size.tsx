/**
 * description: 我们为 `<Input />` 输入框定义了三种尺寸（大、默认、小）。
 */
import { UsersSolid } from '@metaoa/icons';
import { Input } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Input size="large" placeholder="large size" prefix={<UsersSolid />} />
    <br />
    <br />
    <Input placeholder="default size" prefix={<UsersSolid />} />
    <br />
    <br />
    <Input size="small" placeholder="small size" prefix={<UsersSolid />} />
  </>
);

export default App;
