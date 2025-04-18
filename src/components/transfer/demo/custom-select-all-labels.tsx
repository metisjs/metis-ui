import React, { useState } from 'react';
import { Transfer } from 'metis-ui';
import type { SafeKey, TransferProps } from 'metis-ui';

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const mockData: RecordType[] = Array.from({ length: 10 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

const oriTargetKeys = mockData.filter((item) => Number(item.key) % 3 > 1).map((item) => item.key);

const selectAllLabels: TransferProps['selectAllLabels'] = [
  'Select All',
  ({ selectedCount, totalCount }) => `${selectedCount}/${totalCount}`,
];

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<SafeKey[]>(oriTargetKeys);
  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      onChange={setTargetKeys}
      render={(item) => item.title}
      selectAllLabels={selectAllLabels}
    />
  );
};

export default App;
