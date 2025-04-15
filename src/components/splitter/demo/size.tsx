import React from 'react';
import { Space, Splitter } from 'metis-ui';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Space block justify="center" align="center" className="h-full">
    <div className="text-text-secondary text-base">{props.text}</div>
  </Space>
);

const App: React.FC = () => (
  <Splitter className="h-50 bg-gray-950/5 shadow dark:bg-white/5">
    <Splitter.Panel defaultSize="40%" min="20%" max="70%">
      <Desc text="First" />
    </Splitter.Panel>
    <Splitter.Panel>
      <Desc text="Second" />
    </Splitter.Panel>
  </Splitter>
);

export default App;
