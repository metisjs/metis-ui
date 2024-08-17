import React, { useRef, useState } from 'react';
import { Button, ConfigProvider, Drawer } from 'metis-ui';

const App: React.FC = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <ConfigProvider getPopupContainer={() => domRef.current!}>
      <div ref={domRef}>
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
        <Drawer
          title="ConfigProvider"
          placement="right"
          onClose={onClose}
          open={open}
          className="absolute"
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default App;
