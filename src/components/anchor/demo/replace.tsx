import React from 'react';
import { Anchor } from 'metis-ui';

const App: React.FC = () => (
  <div className="flex">
    <div className="basis-2/3">
      <div id="part-1" className="h-screen bg-amber-200" />
      <div id="part-2" className="h-screen bg-red-200" />
      <div id="part-3" className="h-screen bg-sky-200" />
    </div>
    <div className="basis-1/3">
      <Anchor
        replace
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
);

export default App;
