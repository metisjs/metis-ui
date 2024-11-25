import React, { useState } from 'react';
import type { GetProp, ProgressProps } from 'metis-ui';
import { Progress, Segmented } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

type ProgressType = GetProp<ProgressProps, 'type'>;

const App: React.FC = () => {
  const [type, setType] = useState<ProgressType>('line');
  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'trail', desc: 'Only available in line type' },
        { name: 'text' },
      ]}
      rootArgs={[{ name: 'type', type: 'ProgressType' }]}
      extra={
        <Segmented value={type} options={['line', 'circle', 'dashboard']} onChange={setType} />
      }
    >
      <Progress type={type} percent={50} status="active" />
    </SemanticPreview>
  );
};

export default App;
