import React from 'react';
import type { NotificationArgsProps } from 'metis-ui';
import { Button, Divider, notification, Space } from 'metis-ui';

type NotificationPlacement = NotificationArgsProps['placement'];

const App: React.FC = () => {
  const openNotification = (placement: NotificationPlacement) => {
    notification.info({
      message: `Notification ${placement}`,
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      placement,
    });
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={() => openNotification('top')}>
          top
        </Button>
        <Button type="primary" onClick={() => openNotification('bottom')}>
          bottom
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button type="primary" onClick={() => openNotification('topLeft')}>
          topLeft
        </Button>
        <Button type="primary" onClick={() => openNotification('topRight')}>
          topRight
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button type="primary" onClick={() => openNotification('bottomLeft')}>
          bottomLeft
        </Button>
        <Button type="primary" onClick={() => openNotification('bottomRight')}>
          bottomRight
        </Button>
      </Space>
    </>
  );
};

export default App;
