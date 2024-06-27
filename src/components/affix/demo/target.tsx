import { Affix, AffixRef, Button } from 'metis-ui';
import React, { useEffect, useRef } from 'react';

const App: React.FC = () => {
  const affixRef = useRef<AffixRef>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => {
      affixRef.current?.updatePosition();
    };
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, []);

  return (
    <div className="h-24 w-full overflow-auto ring-1 ring-primary" ref={setContainer}>
      <div className="h-[1000px] w-full pt-8">
        <Affix ref={affixRef} target={() => container}>
          <Button type="primary">Fixed at the top of container</Button>
        </Affix>
      </div>
    </div>
  );
};

export default App;
