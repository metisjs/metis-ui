import { Anchor } from 'metis-ui';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const topRef = React.useRef<HTMLDivElement>(null);
  const [targetOffset, setTargetOffset] = useState<number>();

  useEffect(() => {
    setTargetOffset(topRef.current?.clientHeight);
  }, []);

  return (
    <div>
      <div className="flex">
        <div className="basis-3/4">
          <div
            id="part-1"
            style={{ height: '100vh', background: 'rgba(255,0,0,0.02)', marginTop: '30vh' }}
          >
            Part 1
          </div>
          <div id="part-2" style={{ height: '100vh', background: 'rgba(0,255,0,0.02)' }}>
            Part 2
          </div>
          <div id="part-3" style={{ height: '100vh', background: 'rgba(0,0,255,0.02)' }}>
            Part 3
          </div>
        </div>
        <div className="basis-1/4">
          <Anchor
            targetOffset={targetOffset}
            items={[
              {
                key: 'part-1',
                href: '#part-1',
                title: 'Part 1',
              },
              {
                key: 'part-2',
                href: '#part-2',
                title: 'Part 2',
              },
              {
                key: 'part-3',
                href: '#part-3',
                title: 'Part 3',
              },
            ]}
          />
        </div>
      </div>

      <div
        style={{
          height: '30vh',
          background: 'rgba(0,0,0,0.85)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '75%',
          color: '#FFF',
        }}
        ref={topRef}
      >
        <div>Fixed Top Block</div>
      </div>
    </div>
  );
};

export default App;
