import React from 'react';
import { Badge, Card } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview semantics={[{ name: 'root' }, { name: 'indicator' }]}>
    <Badge.Ribbon text="Hippies">
      <Card title="Pushes open the window" size="small" className="w-[384px]">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
  </SemanticPreview>
);

export default App;
