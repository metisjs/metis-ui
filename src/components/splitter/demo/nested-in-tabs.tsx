import React from 'react';
import { Space, Splitter, Tabs } from 'metis-ui';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Space block justify="center" align="center" className="h-full">
    <div className="text-text-secondary text-base">{props.text}</div>
  </Space>
);

const App: React.FC = () => {
  const SplitterContent = (
    <Splitter className="h-50 bg-gray-950/2 dark:bg-white/5">
      <Splitter.Panel collapsible>
        <Desc text={1} />
      </Splitter.Panel>
      <Splitter.Panel
        collapsible={{
          start: true,
        }}
      >
        <Desc text={2} />
      </Splitter.Panel>
      <Splitter.Panel>
        <Desc text={3} />
      </Splitter.Panel>
    </Splitter>
  );
  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: '1',
          label: 'General',
          content: 'Content of Tab Pane 1',
        },
        {
          key: '2',
          label: 'Splitter Tab',
          content: SplitterContent,
        },
      ]}
    />
  );
};

export default App;
