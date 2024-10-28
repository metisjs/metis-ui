import React, { useState } from 'react';
import type { PaginationProps } from 'metis-ui';
import { Pagination, Segmented, Space } from 'metis-ui';

const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

const App: React.FC = () => {
  const [size, setSize] = useState<'default' | 'small' | 'mini'>('default');

  return (
    <Space vertical>
      <Segmented
        value={size}
        options={[
          { label: 'Default', value: 'default' },
          { label: 'Small', value: 'small' },
          { label: 'Mini', value: 'mini' },
        ]}
        onChange={setSize}
        className="mb-4"
      />
      <Pagination size={size} total={50} />
      <Pagination size={size} total={50} showSizeChanger showQuickJumper />
      <Pagination size={size} total={50} showTotal={showTotal} />
      <Pagination
        size={size}
        total={50}
        disabled
        showTotal={showTotal}
        showSizeChanger
        showQuickJumper
      />
    </Space>
  );
};

export default App;
