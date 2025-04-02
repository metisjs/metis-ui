import React from 'react';
import { QRCode } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'mask' }]}>
    {(hover) => (
      <QRCode
        value="https://metisui.com"
        icon="/logo.svg"
        status={hover?.name === 'mask' ? 'scanned' : 'active'}
      />
    )}
  </SemanticPreview>
);

export default App;
