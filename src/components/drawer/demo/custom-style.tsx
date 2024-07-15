import { Button, Drawer, Space } from 'metis-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [open, setOpen] = useState([false, false]);

  const toggleDrawer = (idx: number, target: boolean) => {
    setOpen((p) => {
      p[idx] = target;
      return [...p];
    });
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={() => toggleDrawer(0, true)}>
          Open
        </Button>
        <Button type="primary" onClick={() => toggleDrawer(1, true)}>
          ConfigProvider
        </Button>
      </Space>
      <Drawer
        title="Basic Drawer"
        placement="right"
        footer="Footer"
        onClose={() => toggleDrawer(0, false)}
        open={open[0]}
        className={{
          mask: 'blur-lg',
          content: 'shadow-lg',
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
