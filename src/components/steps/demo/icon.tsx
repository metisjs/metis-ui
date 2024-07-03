import { FaceSmileOutline, LoadingOutline, UserOutline, WalletOutline } from '@metisjs/icons';
import { Steps } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Steps
    items={[
      {
        title: 'Login',
        status: 'finish',
        icon: <UserOutline />,
      },
      {
        title: 'Verification',
        status: 'finish',
        icon: <WalletOutline />,
      },
      {
        title: 'Pay',
        status: 'process',
        icon: <LoadingOutline className="animate-spin" />,
      },
      {
        title: 'Done',
        status: 'wait',
        icon: <FaceSmileOutline />,
      },
    ]}
  />
);

export default App;
