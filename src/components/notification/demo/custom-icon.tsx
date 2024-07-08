import { FaceSmileOutline } from '@metisjs/icons';
import { Button, notification } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const openNotification = () => {
    notification.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      icon: <FaceSmileOutline style={{ color: '#108ee9' }} />,
    });
  };

  return (
    <Button type="primary" onClick={openNotification}>
      Open the notification box
    </Button>
  );
};

export default App;
