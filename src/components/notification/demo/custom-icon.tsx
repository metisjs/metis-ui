import React from 'react';
import { FaceSmileOutline } from '@metisjs/icons';
import { Button, notification } from 'metis-ui';

const App: React.FC = () => {
  const openNotification = () => {
    notification.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      icon: <FaceSmileOutline className="text-blue-500" />,
    });
  };

  return (
    <Button type="primary" onClick={openNotification}>
      Open the notification box
    </Button>
  );
};

export default App;
