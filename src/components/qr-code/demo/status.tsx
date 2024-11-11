import React from 'react';
import { QRCode, Space } from 'metis-ui';

const value = 'https://metis.github.io';

const App: React.FC = () => (
  <Space size="middle" wrap block>
    <QRCode value={value} status="loading" />
    <QRCode value={value} status="expired" onRefresh={() => console.log('refresh')} />
    <QRCode value={value} status="scanned" />
  </Space>
);

export default App;
