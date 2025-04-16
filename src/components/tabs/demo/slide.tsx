import React, { useState } from 'react';
import { Segmented, Tabs } from 'metis-ui';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';

const App: React.FC = () => {
  const [mode, setMode] = useState<TabPosition>('top');
  return (
    <div>
      <Segmented
        value={mode}
        options={[
          {
            label: 'Horizontal',
            value: 'top',
          },
          {
            label: 'Vertical',
            value: 'left',
          },
        ]}
        onChange={setMode}
        className="mb-2"
      />
      <Tabs
        defaultActiveKey="1"
        tabPosition={mode}
        items={new Array(30).fill(null).map((_, i) => {
          const id = String(i);
          return {
            label: `Tab-${id}`,
            key: id,
            disabled: i === 28,
            content: `Content of tab ${id}`,
          };
        })}
        className="h-55"
      />
    </div>
  );
};

export default App;
