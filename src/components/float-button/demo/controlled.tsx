import React, { useState } from 'react';
import { ChatBubbleLeftOutline } from '@metisjs/icons';
import { FloatButton, Switch } from 'metis-ui';

const App: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <>
      <Switch onChange={setOpen} checked={open} className="m-4" />
      <FloatButton.Group
        open={open}
        trigger="click"
        className="end-6"
        icon={<ChatBubbleLeftOutline />}
      >
        <FloatButton />
        <FloatButton />
        <FloatButton icon={<ChatBubbleLeftOutline />} />
      </FloatButton.Group>
      <FloatButton.Group
        open={open}
        shape="square"
        trigger="click"
        style={{ insetInlineEnd: 88 }}
        icon={<ChatBubbleLeftOutline />}
      >
        <FloatButton />
        <FloatButton />
        <FloatButton icon={<ChatBubbleLeftOutline />} />
      </FloatButton.Group>
    </>
  );
};

export default App;
