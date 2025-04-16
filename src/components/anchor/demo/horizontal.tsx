import React from 'react';
import { Anchor } from 'metis-ui';

const App: React.FC = () => (
  <>
    <div className="p-5">
      <Anchor
        direction="horizontal"
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
    <div>
      <div id="part-1" className="h-screen w-screen bg-amber-200 text-center" />
      <div id="part-2" className="h-screen w-screen bg-red-200 text-center" />
      <div id="part-3" className="h-screen w-screen bg-sky-200 text-center" />
    </div>
  </>
);

export default App;
