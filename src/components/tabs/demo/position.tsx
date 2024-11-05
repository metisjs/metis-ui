import React, { useState } from 'react';
import { Segmented, Space, Tabs } from 'metis-ui';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';

const App: React.FC = () => {
  const [tabPosition, setTabPosition] = useState<TabPosition>('left');

  return (
    <>
      <Space>
        <Segmented
          options={['top', 'bottom', 'left', 'right']}
          value={tabPosition}
          onChange={setTabPosition}
          className="mb-4"
        />
      </Space>
      <Tabs
        tabPosition={tabPosition}
        items={new Array(3).fill(null).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            content: `Content of Tab ${id}`,
          };
        })}
      />
    </>
  );
};

export default App;
