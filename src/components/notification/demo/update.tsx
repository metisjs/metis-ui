import { Button, notification } from 'metis-ui';
import React from 'react';

const key = 'updatable';

const App: React.FC = () => {
  const openNotification = () => {
    notification.open({
      key,
      message: 'Notification Title',
      description: 'description.',
    });

    setTimeout(() => {
      notification.open({
        key,
        message: 'New Title',
        description: 'New description.',
      });
    }, 1000);
  };

  return (
    <Button type="primary" onClick={openNotification}>
      Open the notification box
    </Button>
  );
};

export default App;
