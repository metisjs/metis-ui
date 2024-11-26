import React from 'react';
import { Spin } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'wrapper' },
      { name: 'indicator' },
      { name: 'tip' },
      { name: 'fullscreen' },
    ]}
    transform
  >
    {(hover) => (
      <Spin
        tip="Loading"
        fullscreen={hover?.name === 'fullscreen'}
        className={{ fullscreen: 'h-full w-full' }}
      >
        <div className="h-32 w-32 bg-fill-quaternary"></div>
      </Spin>
    )}
  </SemanticPreview>
);

export default App;
