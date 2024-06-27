import { Affix, Button } from 'metis-ui';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [top, setTop] = useState(10);

  return (
    <div style={{ height: 10000 }}>
      <div>Top</div>
      <Affix offsetTop={top}>
        <div style={{ background: 'red' }}>
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
