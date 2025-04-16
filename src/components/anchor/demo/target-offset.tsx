import React, { useEffect, useState } from 'react';
import { Anchor } from 'metis-ui';

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
          <div id="part-1" className="mt-[30vh] h-screen bg-amber-200">
            Part 1
          </div>
          <div id="part-2" className="h-screen bg-red-200">
            Part 2
          </div>
          <div id="part-3" className="h-screen bg-sky-200">
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

      <div className="fixed top-0 left-0 h-[30vh] w-3/4 bg-lime-800 text-white" ref={topRef}>
        <div>Fixed Top Block</div>
      </div>
    </div>
  );
};

export default App;
