import React from 'react';
import { Button, message } from 'metis-ui';

const App: React.FC = () => {
  const success = () => {
    message.open({
      type: 'success',
      content: 'This is a prompt message with custom className and style',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  return <Button onClick={success}>Customized style</Button>;
};

export default App;
