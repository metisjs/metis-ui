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
            content: 'Create a services site',
            time: '2025-09-01 09:12:11',
          },
          {
            content: 'Solve initial network problems',
            time: '2025-09-01 09:12:11',
          },
          {
            content: 'Technical testing',
            time: '2025-09-01 09:12:11',
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
