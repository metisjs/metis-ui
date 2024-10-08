import React from 'react';
import { Alert, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical block>
    <Alert
      message="Success Tips"
      type="success"
      showIcon
      action={
        <a href="#" className="!text-success-text-active hover:!text-success-text-hover">
          Details →
        </a>
      }
    />
    <Alert
      message="Error Text"
      showIcon
      description="Error Description Error Description Error Description Error Description"
      type="error"
      action={
        <a href="#" className="!text-error-text-active hover:!text-error-text-hover">
          Details →
        </a>
      }
    />
  </Space>
);

export default App;
