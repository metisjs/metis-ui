import React from 'react';
import { Button, notification, Space } from 'metis-ui';

const App: React.FC = () => {
  const openNotification = (pauseOnHover: boolean) => () => {
    notification.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      showProgress: true,
      pauseOnHover,
    });
  };

  return (
    <Space>
      <Button type="primary" onClick={openNotification(true)}>
        Pause on hover
      </Button>
      <Button type="primary" onClick={openNotification(false)}>
        Don&apos;t pause on hover
      </Button>
    </Space>
  );
};

export default App;
