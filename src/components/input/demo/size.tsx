import { UserOutline } from '@metaoa/icons';
import { Input } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Input size="large" placeholder="large size" prefix={<UserOutline />} />
    <br />
    <br />
    <Input placeholder="default size" prefix={<UserOutline />} />
    <br />
    <br />
    <Input size="small" placeholder="small size" prefix={<UserOutline />} />
  </>
);

export default App;
