import React from 'react';
import { ArrowUpTrayOutline } from '@metisjs/icons';
import { Button, Space, Upload } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical className="w-full" size="large">
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
      maxCount={1}
    >
      <Button icon={<ArrowUpTrayOutline />}>Upload (Max: 1)</Button>
    </Upload>
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
      maxCount={3}
      multiple
    >
      <Button icon={<ArrowUpTrayOutline />}>Upload (Max: 3)</Button>
    </Upload>
  </Space>
);

export default App;
