import React from 'react';
import { PlusOutline } from '@metisjs/icons';
import { Button, ConfigProvider, Input, Space } from 'metis-ui';

const App: React.FC = () => {
  return (
    <ConfigProvider
      input={{ className: 'outline-primary outline' }}
      button={{ className: { root: 'border-2 border-pink-600', icon: 'text-red-600' } }}
    >
      <Space vertical>
        <Input />
        <Button type="primary" icon={<PlusOutline />}>
          Test
        </Button>
      </Space>
    </ConfigProvider>
  );
};

export default App;
