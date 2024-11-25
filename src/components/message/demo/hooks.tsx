import React from 'react';
import { Button, ConfigProvider, message } from 'metis-ui';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage({
    className: { content: 'text-blue-500' },
  });

  const info = () => {
    messageApi.info('Hello, Metis UI!');
  };

  return (
    <ConfigProvider message={{ className: { icon: 'text-red-500' } }}>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display normal message
      </Button>
    </ConfigProvider>
  );
};

export default App;
