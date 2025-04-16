import React from 'react';
import { Button, Tooltip } from 'metis-ui';

const App: React.FC = () => {
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);

  return (
    <div>
      <div className="flex h-[300vh] w-[300vw] items-center justify-center">
        <Tooltip title="Thanks for using metis ui. Have a nice day!" trigger="click" defaultOpen>
          <Button>Scroll The Window</Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default App;
