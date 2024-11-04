import React, { useState } from 'react';
import type { GetProp, TabsProps } from 'metis-ui';
import { Segmented, Tabs } from 'metis-ui';

type SizeType = GetProp<TabsProps, 'size'>;

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>('default');

  return (
    <div>
      <Segmented
        options={['default', 'middle', 'small']}
        value={size}
        onChange={setSize}
        className="mb-4"
      />
      <Tabs
        defaultActiveKey="1"
        size={size}
        style={{ marginBottom: 32 }}
        items={new Array(3).fill(null).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            children: `Content of tab ${id}`,
          };
        })}
      />
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={size}
        items={new Array(3).fill(null).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Card Tab ${id}`,
            key: id,
            children: `Content of card tab ${id}`,
          };
        })}
      />
    </div>
  );
};

export default App;
