import { Button, Spin } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const [spinning, setSpinning] = React.useState(false);

  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 5;

      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <>
      <Button onClick={showLoader}>Show fullscreen</Button>
      <Spin spinning={spinning} fullscreen size="large" />
    </>
  );
};

export default App;
