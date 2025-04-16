import React from 'react';
import { UserSolid } from '@metisjs/icons';
import { Avatar, Space } from 'metis-ui';

const url =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const App: React.FC = () => (
  <Space size={16} wrap>
    <Avatar icon={<UserSolid />} />
    <Avatar>U</Avatar>
    <Avatar size={40}>USER</Avatar>
    <Avatar src={url} />
    <Avatar src={<img src={url} alt="avatar" />} />
    <Avatar className="bg-pink-200">U</Avatar>
    <Avatar className="bg-lime-500" icon={<UserSolid />} />
  </Space>
);

export default App;
