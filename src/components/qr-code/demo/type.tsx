import React from 'react';
import { QRCode, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space>
    <QRCode type="canvas" value="https://metis.github.io/" />
    <QRCode type="svg" value="https://metis.github.io/" />
  </Space>
);

export default App;
