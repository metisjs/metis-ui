import React from 'react';
import { Button, notification } from 'metis-ui';

const App: React.FC = () => {
  const openNotification = () => {
    notification.open({
      message: 'Notification Title',
      description:
        'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      duration: 0,
    });
  };

  return (
    <Button type="primary" onClick={openNotification}>
      Open the notification box
    </Button>
  );
};

export default App;
