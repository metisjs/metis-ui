import React from 'react';
import { Modal } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'mask' },
      { name: 'content' },
      { name: 'header' },
      { name: 'close' },
      { name: 'body' },
      { name: 'footer' },
    ]}
    transform
  >
    <Modal title="Modal Title" open getContainer={false}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  </SemanticPreview>
);

export default App;
