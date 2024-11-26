import React from 'react';
import { Scrollbar } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';
import { Lorem } from './vertical';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'view' },
      { name: 'trackHorizontal' },
      { name: 'trackVertical' },
      { name: 'thumbHorizontal' },
      { name: 'thumbVertical' },
    ]}
  >
    <Scrollbar autoHide={false} className="h-[300px] max-w-[600px]">
      <div className="w-[800px]">
        <Lorem />
      </div>
    </Scrollbar>
  </SemanticPreview>
);

export default App;
