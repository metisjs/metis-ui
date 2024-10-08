import React from 'react';
import { Progress, Slider, Space } from 'metis-ui';

const App: React.FC = () => {
  const [stepsCount, setStepsCount] = React.useState<number>(5);
  const [stepsGap, setStepsGap] = React.useState<number>(7);
  return (
    <>
      <h5>Custom count:</h5>
      <Slider min={2} max={10} value={stepsCount} onChange={setStepsCount} />
      <h5>Custom gap:</h5>
      <Slider step={4} min={0} max={40} value={stepsGap} onChange={setStepsGap} />
      <Space wrap block className="mt-4">
        <Progress
          type="dashboard"
          steps={{ count: stepsCount, gap: stepsGap }}
          percent={50}
          trailColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
        <Progress
          type="circle"
          percent={100}
          steps={{ count: stepsCount, gap: stepsGap }}
          trailColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
      </Space>
    </>
  );
};

export default App;
