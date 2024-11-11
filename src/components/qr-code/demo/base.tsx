import React from 'react';
import { Input, QRCode, Space } from 'metis-ui';

const App: React.FC = () => {
  const [text, setText] = React.useState('https://metis.github.io/');

  return (
    <Space vertical align="center">
      <QRCode value={text || '-'} />
      <Input placeholder="-" maxLength={60} value={text} onChange={setText} />
    </Space>
  );
};

export default App;
