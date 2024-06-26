import { ArrowDownTrayOutline } from '@metisjs/icons';
import { Button, Space } from 'metis-ui';
import { SizeType } from 'metis-ui/es/config-provider/SizeContext';
import React from 'react';

const App: React.FC = () => (
  <>
    <Space vertical size={20}>
      {(['large', 'middle', 'small'] as SizeType[]).map((size) => (
        <Space wrap key={size}>
          <Button type="primary" size={size}>
            Primary
          </Button>
          <Button size={size}>Default</Button>
          <Button type="text" size={size}>
            Text
          </Button>
          <Button type="link" size={size}>
            Link
          </Button>
          <Button type="primary" icon={<ArrowDownTrayOutline />} size={size} />
          <Button type="primary" shape="round" icon={<ArrowDownTrayOutline />} size={size} />
          <Button type="primary" shape="round" icon={<ArrowDownTrayOutline />} size={size} />
          <Button type="primary" shape="round" icon={<ArrowDownTrayOutline />} size={size}>
            Download
          </Button>
          <Button type="primary" icon={<ArrowDownTrayOutline />} size={size}>
            Download
          </Button>
        </Space>
      ))}
    </Space>
  </>
);

export default App;
