import React, { useState } from 'react';
import type { StepsProps } from 'metis-ui';
import { Card, Radio, Steps } from 'metis-ui';

const App: React.FC = () => {
  const [size, setSize] = useState<StepsProps['size']>('default');
  const description = 'This is a description.';
  const horizontalSteps = (
    <Card>
      <Steps
        size={size}
        items={[
          {
            title: 'Finished',
            description,
          },
          {
            title: 'In Progress',
            description,
          },
          {
            title: 'Waiting',
            description,
          },
        ]}
      />
    </Card>
  );

  return (
    <>
      <Radio.Group className="mb-4" value={size} onChange={setSize}>
        <Radio value="small">Small</Radio>
        <Radio value="default">Default</Radio>
      </Radio.Group>
      <Steps
        size={size}
        direction="vertical"
        items={[
          {
            title: 'Finished',
            description: horizontalSteps,
          },
          {
            title: 'In Progress',
            description,
          },
          {
            title: 'Waiting',
            description,
          },
        ]}
      />
    </>
  );
};

export default App;
