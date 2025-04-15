import React from 'react';
import { Space, Splitter } from 'metis-ui';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Space block justify="center" align="center" className="h-full">
    <div className="text-text-secondary text-base">{props.text}</div>
  </Space>
);

const App: React.FC = () => (
  <Space vertical size="middle" block>
    <div>[true, 0, false]</div>
    <Splitter className="h-50 bg-gray-950/2 dark:bg-white/5">
      <Splitter.Panel>
        <Desc text={1} />
      </Splitter.Panel>
      <Splitter.Panel defaultSize={0}>
        <Desc text={2} />
      </Splitter.Panel>
      <Splitter.Panel resizable={false}>
        <Desc text={3} />
      </Splitter.Panel>
    </Splitter>
    <div>[false, 0, true]</div>
    <Splitter className="h-50 bg-gray-950/2 dark:bg-white/5">
      <Splitter.Panel resizable={false}>
        <Desc text={1} />
      </Splitter.Panel>
      <Splitter.Panel defaultSize={0}>
        <Desc text={2} />
      </Splitter.Panel>
      <Splitter.Panel>
        <Desc text={3} />
      </Splitter.Panel>
    </Splitter>
    <div>Start have min & max</div>
    <Splitter className="h-50 bg-gray-950/2 dark:bg-white/5">
      <Splitter.Panel min={50} max={100}>
        <Desc text={1} />
      </Splitter.Panel>
      <Splitter.Panel>
        <Desc text={2} />
      </Splitter.Panel>
    </Splitter>
    <div>End have min & max</div>
    <Splitter className="h-50 bg-gray-950/2 dark:bg-white/5">
      <Splitter.Panel>
        <Desc text={1} />
      </Splitter.Panel>
      <Splitter.Panel min="20%" max="70%">
        <Desc text={2} />
      </Splitter.Panel>
    </Splitter>
  </Space>
);

export default App;
