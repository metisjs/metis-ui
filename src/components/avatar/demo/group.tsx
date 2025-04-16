import React from 'react';
import { PaperAirplaneOutline, PaperAirplaneSolid, UserSolid } from '@metisjs/icons';
import { Avatar, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical size={24}>
    <Avatar.Group>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
      <a href="https://metisui.com">
        <Avatar className="bg-yellow-500">K</Avatar>
      </a>
      <Avatar className="bg-lime-500" icon={<UserSolid />} />
      <Avatar className="bg-sky-500" icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
    <Avatar.Group maxCount={2} className={{ max: 'bg-rose-300 text-rose-800' }}>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
      <Avatar className="bg-yellow-500">K</Avatar>
      <Avatar className="bg-lime-500" icon={<UserSolid />} />
      <Avatar className="bg-sky-500" icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
    <Avatar.Group maxCount={2} size="large" className={{ max: 'bg-rose-300 text-rose-800' }}>
      <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
      <Avatar className="bg-yellow-500">K</Avatar>
      <Avatar className="bg-lime-500" icon={<UserSolid />} />
      <Avatar className="bg-sky-500" icon={<PaperAirplaneSolid />} />
    </Avatar.Group>
    <Avatar.Group
      maxCount={2}
      maxPopoverTrigger="click"
      size="large"
      className={{ max: 'cursor-pointer bg-rose-300 text-rose-800' }}
    >
      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <Avatar className="bg-yellow-500">K</Avatar>
      <Avatar className="bg-lime-500" icon={<UserSolid />} />
      <Avatar className="bg-sky-500" icon={<PaperAirplaneOutline />} />
    </Avatar.Group>
  </Space>
);

export default App;
