import { UserOutline } from '@metisjs/icons';
import { Avatar, Space } from 'metis-ui';
import React from 'react';

const url =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const App: React.FC = () => (
  <Space size={16} wrap>
    <Avatar icon={<UserOutline />} />
    <Avatar>U</Avatar>
    <Avatar size={40}>USER</Avatar>
    <Avatar src={url} />
    <Avatar src={<img src={url} alt="avatar" />} />
    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutline />} />
  </Space>
);

export default App;
