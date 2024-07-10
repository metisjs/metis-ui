import { Button, message } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const success = () => {
    message
      .open({
        type: 'loading',
        content: 'Action in progress..',
        duration: 2.5,
      })
      .then(() => message.success('Loading finished', 2.5))
      .then(() => message.info('Loading finished', 2.5));
  };

  return <Button onClick={success}>Display sequential messages</Button>;
};

export default App;
