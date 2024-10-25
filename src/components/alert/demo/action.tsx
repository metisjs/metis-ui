import React from 'react';
import { Alert, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical block>
    <Alert
      message="Success Tips"
      type="success"
      showIcon
      action={
        <a href="#" className="!text-success-active hover:!text-success-hover">
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
        <a href="#" className="!text-error-active hover:!text-error-hover">
          Details →
        </a>
      }
    />
  </Space>
);

export default App;
