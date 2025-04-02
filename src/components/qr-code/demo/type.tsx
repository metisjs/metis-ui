import React from 'react';
import { QRCode, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space>
    <QRCode type="canvas" value="https://metisui.com/" />
    <QRCode type="svg" value="https://metisui.com/" />
  </Space>
);

export default App;
