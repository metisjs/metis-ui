import { XCircleOutline } from '@metisjs/icons';
import { Button, Result } from 'metis-ui';
import React from 'react';

const App: React.FC = () => (
  <Result
    status="error"
    title="Submission Failed"
    subTitle="Please check and modify the following information before resubmitting."
    extra={[
      <Button type="primary" key="console">
        Go Console
      </Button>,
      <Button key="buy">Buy Again</Button>,
    ]}
  >
    <p className="mb-2 text-base font-semibold">
      The content you submitted has the following error:
    </p>
    <p className="mb-2 flex items-center gap-1">
      <XCircleOutline className="h-5 w-5 text-error" />
      Your account has been frozen.
      <a>Thaw immediately &gt;</a>
    </p>
    <p className="flex items-center gap-1">
      <XCircleOutline className="h-5 w-5 text-error" />
      Your account is not yet eligible to apply. <a>Apply Unlock &gt;</a>
    </p>
  </Result>
);

export default App;
