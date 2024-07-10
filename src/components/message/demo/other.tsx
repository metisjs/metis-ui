import { Button, message, Space } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const success = () => {
    message.success('This is a success message');
  };

  const error = () => {
    message.error('This is an error message');
  };

  const warning = () => {
    message.warning('This is a warning message');
  };

  return (
    <Space>
      <Button onClick={success}>Success</Button>
      <Button onClick={error}>Error</Button>
      <Button onClick={warning}>Warning</Button>
    </Space>
  );
};

export default App;
