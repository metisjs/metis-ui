import { UserOutline } from '@metisjs/icons';
import { InputNumber } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <InputNumber prefix="￥" className="w-full" />
    <br />
    <br />
    <InputNumber addonBefore={<UserOutline />} prefix="￥" className="w-full" />
    <br />
    <br />
    <InputNumber prefix="￥" disabled className="w-full" />
  </>
);

export default App;
