import React from 'react';
import { MagnifyingGlassPlusOutline } from '@metisjs/icons';
import { Image, Space } from 'metis-ui';

const App: React.FC = () => (
  <Image
    width={96}
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    className={{ preview: { mask: 'text-sm opacity-100' } }}
    preview={{
      mask: (
        <Space vertical align="center" size={4}>
          <MagnifyingGlassPlusOutline className="h-6 w-6" />
          示例
        </Space>
      ),
    }}
  />
);

export default App;
