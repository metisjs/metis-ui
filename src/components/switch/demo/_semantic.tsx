import React from 'react';
import { Switch } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'handle' }]}
    rootArgs={[
      { name: 'disabled', type: 'boolean' },
      { name: 'checked', type: 'boolean' },
    ]}
  >
    <Switch checkedChildren="Open" unCheckedChildren="Close" defaultChecked />
  </SemanticPreview>
);

export default App;
