import { ClockOutline } from '@metisjs/icons';
import { Badge, Space, Switch } from 'metis-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [show, setShow] = useState(true);

  return (
    <Space>
      <Switch checked={show} onChange={() => setShow(!show)} />
      <Badge count={show ? 11 : 0} showZero className="bg-yellow-600" />
      <Badge count={show ? 25 : 0} />
      <Badge count={show ? <ClockOutline className="h-5 w-5 text-error" /> : 0} />
      <Badge count={show ? 109 : 0} className="bg-green-600" />
    </Space>
  );
};

export default App;
