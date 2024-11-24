import React from 'react';
import InternalPanel from 'metis-ui/es/message/PurePanel';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'icon' }]}>
    <InternalPanel content="Hello Metis UI!" type="error" />
  </SemanticPreview>
);

export default App;
