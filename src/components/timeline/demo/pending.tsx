import React, { useState } from 'react';
import { Button, Timeline } from 'metis-ui';

const App: React.FC = () => {
  const [reverse, setReverse] = useState(false);

  const handleClick = () => {
    setReverse(!reverse);
  };

  return (
    <div>
      <Timeline
        pending="Recording..."
        reverse={reverse}
        items={[
          {
            content: 'Create a services site 2015-09-01',
          },
          {
            content: 'Solve initial network problems 2015-09-01',
          },
          {
            content: 'Technical testing 2015-09-01',
          },
        ]}
      />
      <Button type="primary" className="mt-4" onClick={handleClick}>
        Toggle Reverse
      </Button>
    </div>
  );
};

export default App;
