import React from 'react';
import { QRCode } from 'metis-ui';

const App: React.FC = () => (
  <QRCode errorLevel="H" value="https://metis.github.io/" icon="/logo.svg" />
);

export default App;
