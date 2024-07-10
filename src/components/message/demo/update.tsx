import { Button, message } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const key = 'updatable';

  const openMessage = () => {
    message.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      message.open({
        key,
        type: 'success',
        content: 'Loaded!',
        duration: 2,
      });
    }, 1000);
  };

  return (
    <Button type="primary" onClick={openMessage}>
      Open the message box
    </Button>
  );
};

export default App;
