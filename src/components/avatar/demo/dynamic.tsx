import React, { useState } from 'react';
import { Avatar, Button, clsx } from 'metis-ui';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['bg-yellow-500', 'bg-lime-500', 'bg-sky-500', 'bg-pink-500'];
const GapList = [4, 3, 2, 1];

const App: React.FC = () => {
  const [user, setUser] = useState(UserList[0]);
  const [color, setColor] = useState(ColorList[0]);
  const [gap, setGap] = useState(GapList[0]);

  const changeUser = () => {
    const index = UserList.indexOf(user);
    setUser(index < UserList.length - 1 ? UserList[index + 1] : UserList[0]);
    setColor(index < ColorList.length - 1 ? ColorList[index + 1] : ColorList[0]);
  };

  const changeGap = () => {
    const index = GapList.indexOf(gap);
    setGap(index < GapList.length - 1 ? GapList[index + 1] : GapList[0]);
  };

  return (
    <>
      <Avatar className={clsx(color, 'align-middle')} size="large" gap={gap}>
        {user}
      </Avatar>
      <Button size="small" className="mx-4 align-middle" onClick={changeUser}>
        ChangeUser
      </Button>
      <Button size="small" className="align-middle" onClick={changeGap}>
        changeGap
      </Button>
    </>
  );
};

export default App;
