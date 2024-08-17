import React from 'react';
import { Button, message } from 'metis-ui';

const App: React.FC = () => {
  const success = () => {
    message.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });
    // Dismiss manually and asynchronously
    setTimeout(message.destroy, 2500);
  };
  return <Button onClick={success}>Display a loading indicator</Button>;
};

export default App;
