import React from 'react';
import { PaperAirplaneOutline, PaperAirplaneSolid, UserSolid } from '@metisjs/icons';
import { Avatar, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size={24}>
    <Avatar.Group>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
      <a href="https://metis.github.io">
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      </a>
      <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserSolid />} />
      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
    <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserSolid />} />
      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
    <Avatar.Group
      maxCount={2}
      size="large"
      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
    >
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserSolid />} />
      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
    <Avatar.Group
      maxCount={2}
      maxPopoverTrigger="click"
      size="large"
      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
    >
      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserSolid />} />
      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<PaperAirplaneOutline />} />
    </Avatar.Group>
  </Space>
);

export default App;
