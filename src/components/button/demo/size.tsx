/**
 * description: 按钮有大、中、小三种尺寸。<br />通过设置 `size` 为 `large` `small` 分别把按钮设为大、小尺寸。若不设置 `size`，则尺寸为中。
 */
import { ArrowDownTrayOutline } from '@metisjs/icons';
import { Button, Space } from 'meta-ui';
import { SizeType } from 'meta-ui/config-provider/SizeContext';
import React from 'react';

const App: React.FC = () => (
  <>
    <Space direction="vertical" size={20}>
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
