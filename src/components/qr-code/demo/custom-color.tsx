import React from 'react';
import { QRCode, Space, useTheme } from 'metis-ui';

const App: React.FC = () => {
  const theme = useTheme();
  return (
    <Space>
      <QRCode value="https://metisui.com/" color={theme.success} />
      <QRCode value="https://metisui.com/" color={theme.text} bgColor={theme.elevated} />
    </Space>
  );
};

export default App;
