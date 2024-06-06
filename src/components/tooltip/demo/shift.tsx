/**
 * description: 当 Tooltip 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。
 */
import { Button, Tooltip } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  return (
    <div>
      <div
        style={{
          width: '300vw',
          height: '300vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip title="Thanks for using metis ui. Have a nice day!" trigger="click" defaultOpen>
          <Button>Scroll The Window</Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default App;
