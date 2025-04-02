import React from 'react';
import { Button, Popover, QRCode } from 'metis-ui';

const App: React.FC = () => (
  <Popover content={<QRCode value="https://metisui.com" bordered={false} />}>
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default App;
