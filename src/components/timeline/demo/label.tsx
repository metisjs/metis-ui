import React, { useState } from 'react';
import { Radio, Timeline } from 'metis-ui';

const App: React.FC = () => {
  const [mode, setMode] = useState<'left' | 'alternate' | 'right'>('left');

  return (
    <>
      <Radio.Group
        onChange={setMode}
        value={mode}
        style={{
          marginBottom: 20,
        }}
      >
        <Radio value="left">Left</Radio>
        <Radio value="right">Right</Radio>
        <Radio value="alternate">Alternate</Radio>
      </Radio.Group>
      <Timeline
        mode={mode}
        items={[
          {
            label: '2015-09-01',
            content: 'Create a services',
          },
          {
            label: '2015-09-01 09:12:11',
            content: 'Solve initial network problems',
          },
          {
            content: 'Technical testing',
          },
          {
            label: '2015-09-01 09:12:11',
            content: 'Network problems being solved',
          },
        ]}
      />
    </>
  );
};

export default App;
