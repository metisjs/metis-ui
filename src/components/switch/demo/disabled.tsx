/**
 * description: Switch 失效状态。
 */
import { Button, Space, Switch } from 'metis-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  const toggle = () => {
    setDisabled(!disabled);
  };

  return (
    <Space direction="vertical">
      <Switch disabled={disabled} defaultChecked />
      <Button type="primary" onClick={toggle}>
        Toggle disabled
      </Button>
    </Space>
  );
};

export default App;
