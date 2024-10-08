import React from 'react';
import { XMarkSolid } from '@metisjs/icons';
import { Alert, Space } from 'metis-ui';

const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  console.log(e, 'I was closed.');
};

const App: React.FC = () => (
  <Space vertical block>
    <Alert
      message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
      type="warning"
      closable
      onClose={onClose}
    />
    <Alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description Error Description Error Description"
      type="error"
      closable
      onClose={onClose}
    />
    <Alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description Error Description Error Description"
      type="error"
      closable={{
        'aria-label': 'close',
        closeIcon: <XMarkSolid />,
      }}
      onClose={onClose}
    />
  </Space>
);

export default App;
