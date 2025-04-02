import React from 'react';
import { QRCode } from 'metis-ui';

const App: React.FC = () => <QRCode errorLevel="H" value="https://metisui.com/" icon="/logo.svg" />;

export default App;
