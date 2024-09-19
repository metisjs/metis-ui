import React from 'react';
import { ArrowUpTrayOutline } from '@metisjs/icons';
import { Button, Upload } from 'metis-ui';

const App: React.FC = () => (
  <Upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" directory>
    <Button icon={<ArrowUpTrayOutline />}>Upload Directory</Button>
  </Upload>
);

export default App;
