import { Space, Steps } from 'metis-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <Space block vertical size={24}>
      <Steps
        type="navigation"
        current={current}
        onChange={onChange}
        className="rounded-lg border border-neutral-border-secondary"
        items={[
          {
            title: 'Step 1',
            description: 'This is a description.',
          },
          {
            title: 'Step 2',
            description: 'This is a description.',
          },
          {
            title: 'Step 3',
            description: 'This is a description.',
          },
        ]}
      />
      <Steps
        type="navigation"
        current={current}
        onChange={onChange}
        className="rounded-lg border border-neutral-border-secondary"
        items={[
          {
            title: 'Step 1',
          },
          {
            title: 'Step 2',
          },
          {
            title: 'Step 3',
          },
          {
            title: 'Step 4',
          },
        ]}
      />
      <Steps
        type="navigation"
        size="small"
        current={current}
        onChange={onChange}
        className="rounded-lg border border-neutral-border-secondary"
        items={[
          {
            title: 'finish 1',
          },
          {
            title: 'finish 2',
          },
          {
            title: 'current process',
          },
          {
            title: 'wait',
            disabled: true,
          },
        ]}
      />
    </Space>
  );
};

export default App;
