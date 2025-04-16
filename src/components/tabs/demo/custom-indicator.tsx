import React from 'react';
import { Segmented, Tabs } from 'metis-ui';
import type { TabsProps } from 'metis-ui';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  { key: '1', label: 'My Account', content: 'Content of Tab Pane 1' },
  { key: '2', label: 'Company', content: 'Content of Tab Pane 2' },
  { key: '3', label: 'Team Members', content: 'Content of Tab Pane 3' },
];

type Align = 'start' | 'center' | 'end';

const App: React.FC = () => {
  const [alignValue, setAlignValue] = React.useState<Align>('center');
  return (
    <>
      <Segmented
        value={alignValue}
        onChange={setAlignValue}
        options={['start', 'center', 'end']}
        className="mb-2"
      />
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicator={{ size: (origin) => origin - 20, align: alignValue }}
      />
    </>
  );
};

export default App;
