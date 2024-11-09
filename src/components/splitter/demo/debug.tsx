import React from 'react';
import { Space, Splitter } from 'metis-ui';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Space block justify="center" align="center" className="h-full">
    <div className="text-base text-text-secondary">{props.text}</div>
  </Space>
);

const App: React.FC = () => (
  <Space vertical size="middle" block>
    <div>[true, 0, false]</div>
    <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
    <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
    <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Splitter.Panel min={50} max={100}>
        <Desc text={1} />
      </Splitter.Panel>
      <Splitter.Panel>
        <Desc text={2} />
      </Splitter.Panel>
    </Splitter>
    <div>End have min & max</div>
    <Splitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
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
