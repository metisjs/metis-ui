import { Button, Drawer } from 'metis-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="relative h-[200px] overflow-hidden rounded-lg border border-neutral-border-secondary bg-neutral-fill-quaternary p-12">
      Render in this
      <div className="mt-4">
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
      </div>
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        getContainer={false}
      >
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
};

export default App;
