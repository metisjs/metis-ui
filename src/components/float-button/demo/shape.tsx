import React from 'react';
import { ChatBubbleBottomCenterTextOutline } from '@metisjs/icons';
import { FloatButton } from 'metis-ui';

const App: React.FC = () => (
  <>
    <FloatButton
      shape="circle"
      type="primary"
      className="end-24"
      icon={<ChatBubbleBottomCenterTextOutline />}
    />
    <FloatButton
      shape="square"
      type="primary"
      className="end-6"
      icon={<ChatBubbleBottomCenterTextOutline />}
    />
  </>
);

export default App;
