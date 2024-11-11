import React from 'react';
import { Button, Popover, QRCode } from 'metis-ui';

const App: React.FC = () => (
  <Popover content={<QRCode value="https://metis.github.io" bordered={false} />}>
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default App;
