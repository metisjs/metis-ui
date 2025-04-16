import React, { useState } from 'react';
import { Affix, Button } from 'metis-ui';

const App: React.FC = () => {
  const [top, setTop] = useState(10);

  return (
    <div className="h-[10000px]">
      <div>Top</div>
      <Affix offsetTop={top}>
        <div className="bg-red-300">
          <Button type="primary" onClick={() => setTop(top + 10)}>
            Affix top
          </Button>
        </div>
      </Affix>
      <div>Bottom</div>
    </div>
  );
};

export default App;
