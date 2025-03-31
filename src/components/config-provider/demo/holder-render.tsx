import React, { useContext, useLayoutEffect } from 'react';
import { ExclamationCircleOutline } from '@metisjs/icons';
import { Button, ConfigProvider, message, Modal, notification, Space } from 'metis-ui';

const Demo: React.FC = () => {
  const { locale } = useContext(ConfigProvider.ConfigContext);

  useLayoutEffect(() => {
    ConfigProvider.config({
      holderRender: (children) => (
        <ConfigProvider prefixCls="static" locale={locale}>
          {children}
        </ConfigProvider>
      ),
    });
  }, [locale]);

  return (
    <div>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            message.info('This is a normal message');
          }}
        >
          message
        </Button>
        <Button
          type="primary"
          onClick={() => {
            notification.open({
              message: 'Notification Title',
              description:
                'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            });
          }}
        >
          notification
        </Button>
        <Button
          type="primary"
          onClick={() => {
            Modal.confirm({
              title: 'Do you want to delete these items?',
              icon: <ExclamationCircleOutline />,
              content: 'Some descriptions',
            });
          }}
        >
          Modal
        </Button>
      </Space>
    </div>
  );
};

export default Demo;
