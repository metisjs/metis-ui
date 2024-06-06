/**
 * description: 密码框。
 */
import { LockClosedOutline, LockOpenOutline } from '@metisjs/icons';
import { Button, Input, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <Space direction="vertical">
      <Input.Password placeholder="input password" />
      <Input.Password
        placeholder="input password"
        iconRender={(visible) => (visible ? <LockOpenOutline /> : <LockClosedOutline />)}
      />
      <Space direction="horizontal">
        <Input.Password
          placeholder="input password"
          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
        />
        <Button style={{ width: 80 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
          {passwordVisible ? 'Hide' : 'Show'}
        </Button>
      </Space>
    </Space>
  );
};

export default App;
