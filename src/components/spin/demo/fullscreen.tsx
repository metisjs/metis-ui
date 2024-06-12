/**
 * description: `fullscreen` 属性非常适合创建流畅的页面加载器。它添加了半透明覆盖层，并在其中心放置了一个旋转加载符号。
 */
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
