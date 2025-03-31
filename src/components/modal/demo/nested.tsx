import React, { useState } from 'react';
import { Button, clsx, message, Modal, notification, Select, Space, Switch } from 'metis-ui';

const options = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
];

const Demo: React.FC = () => {
  const [messageInstance, messageHolder] = message.useMessage();
  const [notificationInstance, notificationHolder] = notification.useNotification();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onShowStatic = () => {
    Modal.confirm({
      content: <Select open value="1" options={options} />,
    });
  };

  return (
    <Space>
      <Switch
        className={clsx('relative', isModalOpen && 'z-4000')}
        checkedChildren="Open"
        unCheckedChildren="Close"
        onChange={setIsModalOpen}
      />
      <Button onClick={onShowStatic}>Static</Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        footer={null}
        destroyOnClose
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        closable={false}
        className="mt-[100px]"
      >
        <Select open value="1" options={options} />
        <Modal
          title="Nested Modal"
          open={isModalOpen}
          footer={null}
          destroyOnClose
          mask={false}
          onCancel={() => setIsModalOpen(false)}
          maskClosable={false}
          closable={false}
          className={{ root: 'mt-[250px]', body: 'flex justify-center' }}
        >
          <Select open value="1" options={options} />

          <Modal
            title="Nested Modal"
            open={isModalOpen}
            footer={null}
            destroyOnClose
            mask={false}
            maskClosable={false}
            onCancel={() => setIsModalOpen(false)}
            closable={false}
            className={{ root: 'mt-[400px]', body: 'flex justify-center' }}
          >
            <Space wrap>
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you OK?',
                    content: 'I am OK',
                  });
                }}
              >
                Static Confirm
              </Button>

              <Button
                onClick={() => {
                  message.success('Hello World');
                  notification.success({
                    message: 'Hello World',
                  });
                }}
              >
                Static Message, Notification
              </Button>

              <Button
                onClick={() => {
                  messageInstance.success('Hello World');
                  notificationInstance.success({
                    message: 'Hello World',
                  });
                }}
              >
                Hook Message, Notification
              </Button>

              <Select open value="1" options={options} />
            </Space>
          </Modal>
        </Modal>
      </Modal>

      {messageHolder}
      {notificationHolder}
    </Space>
  );
};

export default Demo;
