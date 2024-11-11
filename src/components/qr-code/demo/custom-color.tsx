import React from 'react';
import { QRCode, Space, useTheme } from 'metis-ui';

const App: React.FC = () => {
  const theme = useTheme();
  return (
    <Space>
      <QRCode value="https://metis.github.io/" color={theme.success} />
      <QRCode value="https://metis.github.io/" color={theme.text} bgColor={theme.layout} />
    </Space>
  );
};

export default App;
