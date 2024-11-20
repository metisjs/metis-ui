import React from 'react';
import { ArrowDownOutline } from '@metisjs/icons';
import { Statistic } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'title' },
      { name: 'content' },
      { name: 'prefix' },
      { name: 'suffix' },
      { name: 'value', children: [{ name: 'int' }, { name: 'decimal' }] },
    ]}
  >
    <Statistic
      title="Account Balance"
      value={112893}
      precision={2}
      prefix={<ArrowDownOutline />}
      suffix="CNY"
    />
  </SemanticPreview>
);

export default App;
