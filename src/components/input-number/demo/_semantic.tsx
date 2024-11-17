import React from 'react';
import { InformationCircleOutline } from '@metisjs/icons';
import { clsx, InputNumber } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'prefix' },
      { name: 'input' },
      { name: 'suffix' },
      { name: 'handler' },
      { name: 'addonBefore' },
      { name: 'addonAfter' },
    ]}
  >
    {(hover) => (
      <InputNumber
        addonBefore="+"
        addonAfter="-"
        prefix="¥"
        suffix={<InformationCircleOutline />}
        defaultValue={100}
        className={{ handler: clsx(hover?.name === 'handler' && 'opacity-100') }}
      />
    )}
  </SemanticPreview>
);

export default App;
