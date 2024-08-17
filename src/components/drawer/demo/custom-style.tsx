import React, { useState } from 'react';
import { Button, Drawer, Space } from 'metis-ui';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Space>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open
        </Button>
      </Space>
      <Drawer
        title="Basic Drawer"
        placement="right"
        footer="Footer"
        onClose={() => setOpen(false)}
        open={open}
        className={{
          mask: 'backdrop-blur-sm',
          content: 'shadow-2xl',
          header: 'border-b border-primary',
          body: 'text-base',
          footer: 'border-t border-primary',
        }}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};

export default App;
