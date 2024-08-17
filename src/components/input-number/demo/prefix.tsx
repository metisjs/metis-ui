import React from 'react';
import { UserOutline } from '@metisjs/icons';
import { InputNumber } from 'metis-ui';

const App: React.FC = () => (
  <>
    <InputNumber prefix="￥" className="w-full" />
    <br />
    <br />
    <InputNumber addonBefore={<UserOutline className="h-4 w-4" />} prefix="￥" className="w-full" />
    <br />
    <br />
    <InputNumber prefix="￥" disabled className="w-full" />
  </>
);

export default App;
