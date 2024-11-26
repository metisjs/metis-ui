import React, { useState } from 'react';
import { Button, clsx, Modal, Space } from 'metis-ui';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const classNames = {
    body: clsx('bg-blue-100 p-3'),
    mask: clsx('blur-md'),
    header: clsx('rounded-none border-l-4 border-primary ps-1'),
    footer: clsx('border-t border-gray-400 text-primary'),
    root: clsx('border border-red-400'),
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </Space>
      <Modal
        title="Basic Modal"
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer="Footer"
        className={classNames}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default App;
