import { Affix, Button } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const [top, setTop] = React.useState<number>(100);
  const [bottom, setBottom] = React.useState<number>(100);
  return (
    <>
      <Affix offsetTop={top}>
        <Button type="primary" onClick={() => setTop(top + 10)}>
          Affix top
        </Button>
      </Affix>
      <br />
      <Affix offsetBottom={bottom}>
        <Button type="primary" onClick={() => setBottom(bottom + 10)}>
          Affix bottom
        </Button>
      </Affix>
    </>
  );
};

export default App;
