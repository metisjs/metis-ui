import React from 'react';
import { ArrowUpTrayOutline } from '@metisjs/icons';
import { Button, Popconfirm, Space, Upload } from 'metis-ui';

const App: React.FC = () => (
  <Space>
    Space
    <Button type="primary">Button</Button>
    <Upload>
      <Button icon={<ArrowUpTrayOutline />}>Click to Upload</Button>
    </Upload>
    <Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No">
      <Button>Confirm</Button>
    </Popconfirm>
  </Space>
);

export default App;
