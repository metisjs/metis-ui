import React from 'react';
import { Alert } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'icon' },
      { name: 'content' },
      { name: 'message' },
      { name: 'description' },
      { name: 'action' },
      { name: 'close' },
    ]}
  >
    <Alert
      message="Informational Notes"
      description="Additional description and information about copywriting."
      type="info"
      showIcon
      closable
      action={
        <a href="#" className="text-primary-active hover:text-primary-hover">
          Details
        </a>
      }
    />
  </SemanticPreview>
);

export default App;
