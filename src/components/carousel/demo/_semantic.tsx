import React from 'react';
import { Carousel } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const contentCls = 'h-40 bg-indigo-500 text-center text-white text-lg leading-[160px]';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'arrow' },
      {
        name: 'indicator',
        children: [{ name: 'item', args: [{ name: 'active', type: 'boolean' }] }],
      },
    ]}
  >
    <Carousel showArrow className="w-[600px]">
      <div className={contentCls}>1</div>
      <div className={contentCls}>2</div>
      <div className={contentCls}>3</div>
      <div className={contentCls}>4</div>
    </Carousel>
  </SemanticPreview>
);

export default App;
