import React from 'react';
import { Button, notification, Space } from 'metis-ui';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};

const App: React.FC = () => {
  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => notification.destroy(key)}>
          Confirm
        </Button>
        <Button type="text" size="small" onClick={() => notification.destroy()}>
          Destroy All
        </Button>
      </Space>
    );
    notification.open({
      message: 'Notification Title',
      description:
        'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
      btn,
      key,
      onClose: close,
    });
  };

  return (
    <Button type="primary" onClick={openNotification}>
      Open the notification box
    </Button>
  );
};

export default App;
