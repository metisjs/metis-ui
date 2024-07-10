import { Button, message } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const success = () => {
    message.open({
      type: 'success',
      content: 'This is a prompt message for success, and it will disappear in 10 seconds',
      duration: 10,
    });
  };

  return <Button onClick={success}>Customized display duration</Button>;
};

export default App;
