/**
 * description: 显示关闭按钮，点击可关闭警告提示。
 */
import { XMarkSolid } from '@metisjs/icons';
import { Alert, Space } from 'metis-ui';
import React from 'react';

const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  console.log(e, 'I was closed.');
};

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
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
