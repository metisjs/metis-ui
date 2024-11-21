import React from 'react';
import { Tooltip } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'overlay' }, { name: 'content' }, { name: 'arrow' }]}
    rootArgs={[{ name: 'open', type: 'boolean' }]}
  >
    <Tooltip title="prompt text" open getPopupContainer={(node) => node.parentElement!}>
      <span>Tooltip will show on mouse enter.</span>
    </Tooltip>
  </SemanticPreview>
);

export default App;
