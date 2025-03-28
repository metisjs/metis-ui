import React from 'react';
import { ChatBubbleLeftOutline } from '@metisjs/icons';
import { FloatButton } from 'metis-ui';

const App: React.FC = () => (
  <>
    <FloatButton.Group
      trigger="click"
      type="primary"
      className="end-6"
      icon={<ChatBubbleLeftOutline />}
    >
      <FloatButton />
      <FloatButton icon={<ChatBubbleLeftOutline />} />
    </FloatButton.Group>
    <FloatButton.Group
      trigger="hover"
      type="primary"
      className="end-24"
      icon={<ChatBubbleLeftOutline />}
    >
      <FloatButton />
      <FloatButton icon={<ChatBubbleLeftOutline />} />
    </FloatButton.Group>
  </>
);

export default App;
